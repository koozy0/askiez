const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a children schemas
const answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  upvotes: { type: Number },
  downvotes: { type: Number },
  creator: { type: String, required: true }
})
// create parent schema
const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  answer: [ answerSchema ],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  creator: { type: String, required: true, default: 'Anonymous' }
})

const Thread = mongoose.model('Thread', threadSchema, 'threads')

// make this available to our other files
module.exports = Thread
