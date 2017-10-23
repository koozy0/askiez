const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// create a schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  threads: [ { type: String } ],
  answers: [ { type: String } ]
})

userSchema.pre('save', function(next) {
  var user = this
  //hash the password
  bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash
    next() // next() is calling the save()
  })
})

const User = mongoose.model('User', userSchema, 'users')

// make this available to our other files
module.exports = User
