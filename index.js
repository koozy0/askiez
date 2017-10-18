// requires
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs  = require('express-handlebars')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const User = require('./models/user')
const Thread = require('./models/thread')

const app = express();

// connect to mongoose
mongoose.connect('mongodb://localhost/askiez', {
  useMongoClient: true
})
mongoose.Promise = global.Promise

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// use bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// static path setup
app.use(express.static(path.join(__dirname, 'public')))

/* ---------- start of / ---------- */
// home
app.get('/', (req, res) => {
  Thread.find((err, data) => {
    var context = {
      title: 'Threads',
      threads: data
    }
    res.render('home', context)
  })
})
/* ---------- end of / ---------- */

/* ---------- start of /thread ---------- */
// GET
app.get('/thread/:id', (req, res) => {
  let threadIndex = req.params.id
  Thread.findById(threadIndex, (err, data) => {
    var context = {
      title: data.title,
      subtitle: data.description,
      username: data.creator,
      threads: data
    }
    res.render('thread', context)
  })
})
// POST
app.post('/thread/:id', (req, res) => {
  let threadIndex = req.params.id
  var newAnswer = {
    answer: req.body.answer
  }
  Thread.findById(threadIndex, (err, thread) => {
    thread.answer.push(newAnswer)
    thread.save(() => {
      var context = {
        title: thread.title,
        subtitle: thread.description,
        username: thread.creator,
        threads: thread
      }
      res.render('thread', context)
    })
  })
})
/* ---------- end of /thread ---------- */

/* ---------- start of /new ---------- */
// GET
app.get('/new', (req, res) => {
  var context = {
    title: 'Create New Thread'
  }
  res.render('new-thread', context)
})
// POST
app.post('/new', (req, res) => {
  // creating new thread and saving to collection
  var newThread = new Thread({
    title: req.body.title,
    description: req.body.description
  })
  newThread.save(() => {
    // render new page after saving to collection
    var context = {
      title: 'Create New Thread',
      subtitle: 'Thread Created!'
    }
    res.render('new-thread', context)
  })

});
/* ---------- end of /new ---------- */

/* ---------- start of /login ---------- */
// GET
app.get('/login', (req, res) => {
  var context = {
    title: 'Login',
    subtitle: 'or Register'
  }
  res.render('landing', context)
})
// POST

/* ---------- end of /login ---------- */

app.listen(4000, () => {
  console.log('server is running on port 4000')
})
