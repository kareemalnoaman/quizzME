

Prerequists:

-MySQL installed locally

-Start MySQL server

-Connect to the MySQL server via Workbench or Terminal to access database.



-Steps to run this app:

-Clone this repo to your local machine: 

  $ git clone https://github.com/kareemalnoaman/quizzME.git
  
-Change directory:

$ cd quizzME

-In Terminal, type this command:

  $ nodemon server.js
  
-In the browser copy and paste url: 

  localhost:3000
  
-You should see the website a live.

To use CRUD:

As a random user, the user will see the landing Home page, from there go to Game tab,
the user will be able to play the math quiz game by generating random math questions then answer them within 10 minutes.
After the 10 minutes have past, user will be prompted to subscripe.

In the case of subscripted user, the user will be prompted to log in or loging as a returned user.

New user would be prompted to register.

Two options: 1) general users can generate timed questions (10 mins each session)
Subscriped users have unlimited access + help
