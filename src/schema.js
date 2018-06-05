'use strict'

const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

/* ====================================================  USER / GROUP SCHEMA ======================================================= */

const userSchema = mongoose.Schema({ // individuals
    username: {
        type: String,
        index: { unique: true },
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    email: String,
    version: {
        type: Number, // 1 = Community, 2 = Enterprise
        permissions: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Team'}, { access: String }]], // permissions can be an id of team (giving a user read/write access. Must specify for each user, it doesn't assume automatic read access for users in an organization).
        organizationsPartOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }]
    },
    trill: Boolean
});

userSchema.plugin(passportLocalMongoose)

/* ================================================  TEAM SCHEMA =================================================== */

const teamSchema = mongoose.Schema({ // recursive structure, such that teams can be nested in other teams
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    root: Boolean, // if the team is at the first level of all teams
    version: {
        type: Number, // 1 = Community, 2 = Enterprise
        usersContained: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        teamsContained: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
        organizationsPartOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}] // only if enterprise, otherwise null
    },
    adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_on: Date,
    last_modified: Date,
    img: String,
    description: String
});

/* ================================================  ORGANIZATION SCHEMA =================================================== */

const organizationSchema = mongoose.Schema({
    name: String,
    teamsContained: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    permissions: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Team'}, { access: String }]], // permissions can be an id of team (giving an org read/write access to other teams, perhaps within other organizations). Default is no access.
    description: String,
    created_on: Date,
    img: String,
    description: String
});

/* ================================================  PROJECT / SPACE SCHEMA =================================================== */

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    img: String,
    data: String, // would hold, links, nodes, and datasets used
    published: Boolean,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_on: Date,
    last_modified: Date,
})

/* ======================================================  DATA SCHEMA ========================================================== */

const dataSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: String,
    id: String,
    favorited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: {
        currentCommentNumber: String,
        commentList: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }, { comment: String}, { order: Number}]]
    }
    // later on can add projects here (such that a user can see exciting projects where this dataset was used)
})

exports.User            = mongoose.model('User', userSchema)
exports.Project         = mongoose.model('Project', projectSchema)
exports.Data            = mongoose.model('Data', dataSchema)
exports.Team            = mongoose.model('Team', teamSchema)
exports.Organization    = mongoose.model('Organization', organizationSchema)

