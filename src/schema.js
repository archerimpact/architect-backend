'use strict'

const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    img: String,
    data: String,
    created_on: Date,
    last_modified: Date,
})

exports.Project = mongoose.model('Project', projectSchema)
