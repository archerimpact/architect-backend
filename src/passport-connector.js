'use strict'

const schema = require('./schema')
const User = schema.User

const archutil = require('./architect-util')
const success = archutil.success
const error   = archutil.error

// TODO validate usernames
function usernameIsValid(str) {
    return true
}


exports.login = async function login(req, res, next) {
    // this check should probably never evaluate, since passport.authenticate will have already failed.
    if (!req.user) { return error('Invalid login attempt', res) }
    return success('Logged in successfully', res)
}


exports.logout = async function logout(req, res) {
    req.logout()
    return success('Logged out successfully', res)
}


exports.verify = async function verify(req, res) {
    if (!req.isAuthenticated()) { return error('Invalid authentication', res) }
    return success('Valid authentication', res)
}


exports.register = async function register(req, res) {
    const username = req.body.username
    const password = req.body.password

    if (!username || !usernameIsValid(username)) { return error('Invalid username', res) }
    if (!password) { return error('Invalid password', res) }

    const newUser      = new User({ username: username, password: password })
    const registration = await User.register(newUser, password)

    if (!registration) { return error('Registration failed; please try again', res) }

    return success('Registered successfully', res)
}
