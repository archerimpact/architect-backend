'use strict'

const mongoose = require('mongoose')
const schema = require('./schema')
const projects = require('./projects')

const fs = require('fs')
const path = require('path')

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()

const credentials = require('./credentials')

const mongoURL = 'mongodb://arch2:' + credentials.mongoPassword + '@ds263639.mlab.com:63639/architect'
mongoose.connect(mongoURL)

app.use(bodyParser.urlencoded({extended: true, limit: '100mb', parameterLimit: 50000}))
app.use(bodyParser.json({limit: '100mb'}))

//////////// Setting Headers (CORS) ////////////
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Content-Type, Accept, Origin, Referer, Accept, User-Agent')
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)
    // Pass to next layer of middleware
    next();
});
////////////////////////////////////////////////



const sessionOptions = {
    resave: false,              // don't save session if unmodified
    saveUninitialized: false,   // don't create session until something stored
    secret: credentials.sessionSecret,
    proxy: false,
    name: 'sessionId',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 10080000,       // 1000*60*60*24*7 // Note persistent vs session cookies
        expires: new Date(new Date().getTime() + (1000*60*60*24*7)) // 7 days
    },
}
app.use(session(sessionOptions))


app.listen(8000, '127.0.0.1', () => {
    console.log('Server has started')
})

/* Project Management */
app.post('/projects/create',    projects.create)
// app.put('/projects/update',     projects.update)
app.get('/projects/get',        projects.get)
// app.get('/projects/all',        projects.list)
// app.delete('/projects/delete',  projects.delete)

app.get('/submit/email', async function(req, res) {
    const email = req.query.email
    if (!email) {
        return res.status(400).end()
    }

    await fs.appendFile(path.join(__dirname, 'submissions', 'email.txt'), JSON.stringify(email) + ',\n', err => {
        if (err) {
            console.log('Could not write to email file: ' + err)
            return res.status(400).end()
        }
    })
    console.log('New email submission! ' + email)
    return res.status(200).end()
});


/* General Routes */
app.get('/', (req, res) => {
    console.log('Server running!')
})

app.get('*', function(req, res) {
    res.status(404).send('Not found')
})
