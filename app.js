// Dependencies
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Load routes
const books = require('./routes/books');
const concerts = require('./routes/concerts');
const movies = require('./routes/movies');
const plays = require('./routes/plays');
const series = require('./routes/series');
const users = require('./routes/users');

// DB Config
const db = require('./config/database');

// Passport config
require('./config/passport')(passport);

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/mediajournal-dev', {
	useMongoClient: true
})
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err));



// Handlebars Middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
	secret: 'nunya',
	resave: true,
	saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Index Route
app.get('/', (req, res)=>{
	const title = 'Thoughts?';
	res.render('index', {
		title:title
	});
});

// Use routes
app.use('/books', books);
app.use('/concerts', concerts);
app.use('/movies', movies);
app.use('/plays', plays);
app.use('/series', series);
app.use('/users', users);

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, () =>{
	console.log(`Server started on port ${port}`);
})
