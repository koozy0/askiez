const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  threads: [ { type: String } ],
  answers: [ { type: String } ]
})

const User = mongoose.model('User', userSchema, 'users')

// make this available to our other files
module.exports = User
