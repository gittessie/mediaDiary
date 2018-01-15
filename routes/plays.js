const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Play Model
require('../models/Play');
const Play = mongoose.model('plays');


// Play Index Page
router.get('/', ensureAuthenticated, (req,res)=>{
	Play.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(plays => {
			res.render('plays/index', {
				plays: plays
			});
		});
})

// Add Play Form
router.get('/add', ensureAuthenticated, (req, res)=>{
	res.render('plays/add');
});

// Edit Play Form
router.get('/edit/:id', ensureAuthenticated, (req, res)=> {
	Play.findOne({
		_id: req.params.id
	})
	.then(play => {
    if(play.user != req.user.id){
      // this ain't your account waaaat
      res.redirect('/plays');
    } else {
      res.render('plays/edit', {
  			play: play
  		});
    }
	});
});


// Process Play Form
router.post('/', ensureAuthenticated, (req, res)=>{
	let errors = [];

	if(!req.body.title){
		errors.push({text: 'Please add a title.'});
	}
	if(!req.body.rating){
		errors.push({text: 'Please provide a rating.'});
	}
	if(errors.length >0){
		res.render('plays/add', {
			errors: errors,
			title: req.body.title,
			venue: req.body.venue,
			date: req.body.date,
			rating:req.body.rating,
			review: req.body.review
		});
	} else {
		var newPlay;
		if(req.body.date != ""){
			newPlay = {
				title: req.body.title,
				venue: req.body.venue,
				date: req.body.date,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		} else {
			newPlay = {
				title: req.body.title,
				venue: req.body.venue,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		}
		new Play(newPlay)
			.save()
			.then(play => {
				req.flash('success_msg', "Play added.");
				res.redirect('/plays');
			})
	}
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res)=> {
	Play.findOne({
		_id: req.params.id
	})
	.then(play => {
		//new values
		play.title = req.body.title;
		play.venue = req.body.venue;
		play.rating = req.body.rating;
		play.review = req.body.review;
		if(req.body.date != ""){
			play.date = req.body.date;
		}
		play.save()
			.then(play => {
				req.flash('success_msg', 'Play updated.');
				res.redirect('/plays');
			})
	});
});

// Delete Play
router.delete('/:id', ensureAuthenticated, (req, res)=>{
	Play.remove({
		_id: req.params.id
	})
	.then(()=>{
		req.flash('success_msg', 'Play removed.');
		res.redirect('/plays');
	})
});


module.exports = router;
