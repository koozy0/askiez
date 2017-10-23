// setting all global variables
const dbURL = process.env.MONGODB_URI|| 'mongodb://localhost/askiez'
const port = process.env.PORT || 4000

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
  .then(thread => {
    render('home', req, res, thread)
  })
})
// POST
app.post('/', (req, res) => {
  var threadId = req.body.id
  var upvoteChange = Number(req.body.upvotes)
  var downvoteChange = Number(req.body.downvotes)

  // creating updateObj depending on upvote/downvote
  if(upvoteChange > 0) var updateObj = {$inc: {upvotes: upvoteChange}}
  else if(downvoteChange > 0) var updateObj = {$inc: {downvotes: downvoteChange}}

  // find thread and update votes
  Thread.findByIdAndUpdate(threadId, updateObj, (err, data) => {
    if(err) console.log(err)
  })
})
/* ---------- end of / ---------- */

/* ---------- start of /thread ---------- */
// GET
app.get('/thread/:id', (req, res) => {
  let threadIndex = req.params.id
  Thread.findById(threadIndex, (err, thread) => {
    render('thread', req, res, thread)
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
      render('updateThread', req, res, thread)
    })
  })
})
/* ---------- end of /thread ---------- */

/* ---------- start of /new ---------- */
// GET
app.get('/new', (req, res) => {
  render('createThread', req, res)
})
// POST
app.post('/new', (req, res) => {
  // creating new thread and saving to collection
  var newThread = new Thread({
    title: req.body.title,
    description: req.body.description
  })
  newThread.save()
  .then(() => {
    // render new page after saving to collection
    render('createdThread', req, res)
  })

});
/* ---------- end of /new ---------- */

/* ---------- start of /login ---------- */
// GET
app.get('/login', (req, res) => {
  render('login', req, res)
})
// POST
app.post('/login', (req,res) => {

})
/* ---------- end of /login ---------- */

/* ---------- start of /register ---------- */
// GET
app.get('/register', (req, res) => {
  render('register', req, res)
})
// POST
app.post('/register', (req,res) => {
  var newUser = new User({
    email: req.body.email,
    password: req.body.password
  })
  newUser.save()
  .then(() => {
    render('registered', req, res)
  })

})
/* ---------- end of /register ---------- */

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})

function render(page, req, res, data) {
  var context = {}
  switch (true) {
    case (page === 'login'):
      context = {
        title: 'Login'
      }
      res.render('login', context)
      break;
    case (page === 'createdThread'):
      context = {
        title: 'Create New Thread',
        subtitle: 'Thread Created!'
      }
      res.render('new-thread', context)
      break;
    case (page === 'createThread'):
      context = {
        title: 'Create New Thread'
      }
      res.render('new-thread', context)
      break;
    case (page === 'updateThread'):
      context = {
        title: data.title,
        subtitle: data.description,
        username: data.creator,
        threads: data
      }
      res.render('thread', context)
      break;
    case (page === 'thread'):
      context = {
        title: data.title,
        subtitle: data.description,
        username: data.creator,
        threads: data
      }
      res.render('thread', context)
      break;
    case (page === 'home'):
      context = {
        title: 'Askiez',
        helpers: {
            countVotes: function (upvotes, downvotes) { return upvotes - downvotes }
        },
        threads: data
      }
      res.render('home', context)
      break;
    case (page === 'register'):
      context = {
        title: 'Register'
      }
      res.render('register', context)
      break;
      case (page === 'registered'):
        context = {
          title: 'Register',
          subtitle: 'New User Created'
        }
        res.render('register', context)
        break;
  }
}
