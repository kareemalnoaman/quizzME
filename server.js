require('dotenv').config()
const express = require('express') // Express for server
const path = require('path')
const app = express()
const database = require("./models/database") // MYSQL database connection
const helpers = require('./helpers/functions')
const { engine } = require('express-handlebars') // Handlebars for dynamic html rendering
const bcrypt = require('bcrypt') // For password hashing
const jwt = require('jsonwebtoken') // For signing and verifying cookies
const { error } = require('console')
const { subscribe } = require('diagnostics_channel')

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: '',
    partialsDir: path.join(__dirname, 'views/partials')
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(require("cookie-parser")())
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.use((req, res, next) => {
    database.getConnection(function (err, connection) {
        if (err) {
            console.log(err)
            res.render('404')
        } else {
            req.db = connection
            next()
        }
    })
})

app.use((req, res, next) => {

    if (req.cookies?.user) {
        const userToken = req.cookies.user
        try {
            const user = jwt.verify(userToken, process.env.COOKIES_ENCRYPTION_KEY)
            req.user = user
        } catch (err) {
            res.clearCookie('user')
        }
    }
    next()
})

app.get(['/help'], (req, res, next) => {
    if (!req.user) {
        res.redirect('/login')
    } else {
        next()
    }
})
app.get(['/login/:type?', '/signup/:type?'], (req, res, next) => {
    if (req.user) {
        if (req.params.type === 'paid') {
            res.redirect('/payment')
        } else {
            res.redirect('/')
        }
    } else {
        next()
    }
})

app.get('/price', (req, res) => {
    if (req.user) {
        res.redirect('/payment')
    } else {
        res.render('price', {
            user: req.user
        })
    }
})

app.get('/', async (req, res) => {
    res.render('index', {
        user: req.user
    })

})

app.get('/login/:type?', (req, res) => {
    res.render('login', {
        user: req.user,
        type: req.params?.type
    })
})

app.get('/signup/:type?', (req, res) => {
    res.render('signup', {
        user: req.user,
        type: req.params?.type
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        user: req.user
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        user: req.user
    })
})

app.get('/quizzme', (req, res) => {
    res.render('quizzme', {
        user: req.user
    })
})

app.get('/price', (req, res) => {
    res.render('price', {
        user: req.user
    })
})

app.get('/payment', (req, res) => {
    res.render('payment', {
        user: req.user
    })
})

app.get('/admin/questions', (req, res) => {

    res.render('admin/questions')
})

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (
        helpers.isName(firstName + lastName) &&
        helpers.isEmail(email) &&
        helpers.isPassword(password)
    ) {
        try {
            const salt = bcrypt.genSaltSync(parseInt(process.env.BYCRYPT_SALT_ROUNDS))
            const hash = bcrypt.hashSync(password, salt);
            const query = 'INSERT INTO Users (first_name,last_name,email,password) VALUES(?,?,?,?)'
            const values = [firstName, lastName, email, hash]
            req.db.query(query, values, (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(400).send('already exists')
                } else {
                    const token = jwt.sign({
                        id: results.insertId,
                        firstName, lastName, subscribed: false
                    }, process.env.COOKIES_ENCRYPTION_KEY)
                    res.cookie('user', token, {
                        expires: new Date(Date.now() + 7 * 24 * 3600000),
                        httpOnly: true
                    })
                    res.status(200).send('200 ok')
                }
            })

        } catch (err) {
            console.log(err)
            res.status(400).send('Server error')
        }
    } else {
        res.status(400).send('Invalid input')
    }
})

app.post('/login', (req, res) => {
    const { email, password } = req.body
    if (
        helpers.isEmail(email) &&
        helpers.isPassword(password)
    ) {
        const query = 'SELECT * FROM Users where email = ?'
        const values = [email]
        req.db.query(query, values, (err, results) => {
            if (err) {
                res.status(400).send('Error loggin')
            } else if (results.length === 0) {
                res.status(401).send('Invalid login credentials')
            } else {
                const valid = bcrypt.compareSync(password, results[0].password)

                if (valid) {
                    const token = jwt.sign({
                        id: results[0].user_id,
                        firstName: results[0].first_name,
                        lastName: results[0].last_name,
                        subscribed: results[0].subscribed == 1 ? true : false
                    }, process.env.COOKIES_ENCRYPTION_KEY)
                    res.cookie('user', token, {
                        expires: new Date(Date.now() + 7 * 24 * 3600000),
                        httpOnly: true
                    })
                    res.status(200).send('200 ok')
                } else {
                    res.status(400).send('Invalid login information')
                }
            }
        })

    } else {
        res.status(400).send('Invalid input')
    }
})

app.post('/logout', (req, res) => {
    res.clearCookie('user')
    res.status(200).send('200 ok')
})

app.post('/admin/questions/add-question', (req, res) => {
    console.log(req.body)
    const { question, category, options, answer } = req.body
    const query = 'INSERT INTO Questions (question_subject, question_caregory) VALUES(?,?)'
    const values = [question, category]
    req.db.beginTransaction((err) => {
        req.db.query('INSERT INTO Questions(question_subject, question_category) VALUES(?,?)', values, (err, results) => {
            if (err) {
                console.log(err)
                res.status(400).send('Error adding question')
            } else {
                const q_id = results.insertId
                const optionValues = []
                options.forEach((option) => {
                    optionValues.push([q_id, option])
                })

                req.db.query('INSERT INTO question_options(question_id, option_text) values ?', [optionValues], (err, op_results) => {
                    if (err) {
                        console.log(err)
                        res.status(400).send('Error adding option')
                    } else {
                        console.log(op_results)
                        console.log('options were added')
                        res.status(200).send('200 ok')
                    }
                })


                // req.db.commit((err) => {
                //     if(err) {
                //         console.log(err)
                //         res.status(400).send('Error adding question')
                //     } else {
                //         res.status(200).send('200 ok')
                //     }
                // })
            }
        })
    })
})

app.get("/price", (req, res) => {
    res.render("price");
})
app.listen(3000)