module.exports = {
    isEmail: (email) => {
        const permittedEmails = new RegExp(/^[._A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@gmail|hotmail|yahoo|aol|outlook.com$/i)
        return permittedEmails.test(email)
    },
    isName: (name) => {
        const permittedNames = new RegExp(/^[a-zA-Z]+$/)
        return permittedNames.test(name)
    },
    isPassword: (password) => {
        const permittedPasswords = new RegExp(/\s/g)
        return !permittedPasswords.test(password)
    }
}