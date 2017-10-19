// setting all global variables
const dbURL = 'mongodb://localhost/askiez'
const port = 4000

// installing all modules
const express = require('express') // express
const path = require('path') // for Public files
const mongoose = require('mongoose') // mongoose
const exphbs  = require('express-handlebars') // handlebars
const bodyParser = require('body-parser') // for accessing POST request

// models
const User = require('./models/user')
const Thread = require('./models/thread')

// initiating express
const app = express()

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// static path setup
app.use(express.static(path.join(__dirname, 'public')))

// setup bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Promise so we can use .then()
mongoose.Promise = global.Promise
// connect to mongodb via mongoose
mongoose.connect(dbURL, {
  useMongoClient: true
})
.then(
  () => { console.log('Connected to database') },
  (err) => { console.log(err) }
)

/* ---------- start of / ---------- */
// GET
app.get('/', (req, res) => {
  Thread.find().limit(10)
  .then(restaurants => {
    var context = {
      title: 'Askiez',
      threads: restaurants
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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
