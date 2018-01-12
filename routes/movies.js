const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Movie Model
require('../models/Movie');
const Movie = mongoose.model('movies');


// Movie Index Page
router.get('/', ensureAuthenticated, (req,res)=>{
	Movie.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(movies => {
			res.render('movies/index', {
				movies: movies
			});
		});
})

// Add Movie Form
router.get('/add', ensureAuthenticated, (req, res)=>{
	res.render('movies/add');
});

// Edit Movie Form
router.get('/edit/:id', ensureAuthenticated, (req, res)=> {
	Movie.findOne({
		_id: req.params.id
	})
	.then(movie => {
    if(movie.user != req.user.id){
      // this ain't your account waaaat
      res.redirect('/movies');
    } else {
      res.render('movies/edit', {
  			movie: movie
  		});
    }
	});
});


// Process Movie Form
router.post('/', ensureAuthenticated, (req, res)=>{
	let errors = [];

	if(!req.body.title){
		errors.push({text: 'Please add a title.'});
	}
	if(!req.body.rating){
		errors.push({text: 'Please provide a rating.'});
	}
	if(errors.length >0){
		res.render('movies/add', {
			errors: errors,
			title: req.body.title,
			releaseYear: req.body.year,
			date: req.body.date,
			rating:req.body.rating,
			review: req.body.review
		});
	} else {
		var newMovie;
		if(req.body.date != ""){
			newMovie = {
				title: req.body.title,
				releaseYear: req.body.year,
				date: req.body.date,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		} else {
			newMovie = {
				title: req.body.title,
				releaseYear: req.body.year,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		}
		new Movie(newMovie)
			.save()
			.then(movie => {
				req.flash('success_msg', "Movie added.");
				res.redirect('/movies');
			})
	}
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res)=> {
	Movie.findOne({
		_id: req.params.id
	})
	.then(movie => {
		//new values
		movie.title = req.body.title;
		movie.releaseYear = req.body.year;
		movie.rating = req.body.rating;
		movie.review = req.body.review;
		if(req.body.date != ""){
			movie.date = req.body.date;
		}
		movie.save()
			.then(movie => {
				req.flash('success_msg', 'Movie updated.');
				res.redirect('/movies');
			})
	});
});

// Delete Movie
router.delete('/:id', ensureAuthenticated, (req, res)=>{
	Movie.remove({
		_id: req.params.id
	})
	.then(()=>{
		req.flash('success_msg', 'Movie removed.');
		res.redirect('/movies');
	})
});


module.exports = router;
