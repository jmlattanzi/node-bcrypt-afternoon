require('dotenv').config()
const express = require('express')
const session = require('express-session')
const { json } = require('body-parser')
const massive = require('massive')
const ac = require('./controllers/authController')
const tc = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const PORT = 4000
const app = express()
app.use(json())
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: false,
    })
)

massive(process.env.CONNECTION_STRING)
    .then((db) => app.set('db', db))
    .catch((err) => console.log(err))

app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)

app.get('/api/treasure/dragon', tc.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, tc.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, tc.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, tc.getAllTreasure)

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
