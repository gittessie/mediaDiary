const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Concert Model
require('../models/Concert');
const Concert = mongoose.model('concerts');


// Concert Index Page
router.get('/', ensureAuthenticated, (req,res)=>{
	Concert.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(concerts => {
			res.render('concerts/index', {
				concerts: concerts
			});
		});
})

// Add Concert Form
router.get('/add', ensureAuthenticated, (req, res)=>{
	res.render('concerts/add');
});

// View Concert 
router.get('/concert/:id', ensureAuthenticated, (req, res)=> {
	Concert.findOne({
		_id: req.params.id
	})
	.then(concert => {
    if(concert.user != req.user.id){
      // this ain't your account waaaat
      res.redirect('/concerts');
    } else {
      res.render('concerts/concert', {
  			concert: concert
  		});
    }
	});
});

// Edit Concert Form
router.get('/edit/:id', ensureAuthenticated, (req, res)=> {
	Concert.findOne({
		_id: req.params.id
	})
	.then(concert => {
    if(concert.user != req.user.id){
      // this ain't your account waaaat
      res.redirect('/concerts');
    } else {
      res.render('concerts/edit', {
  			concert: concert
  		});
    }
	});
});


// Process Concert Form
router.post('/', ensureAuthenticated, (req, res)=>{
	let errors = [];

	if(!req.body.headliner){
		errors.push({text: 'Please add a headliner.'});
	}
	if(!req.body.rating){
		errors.push({text: 'Please provide a rating.'});
	}
	if(errors.length >0){
		res.render('concerts/add', {
			errors: errors,
      headliner: req.body.headliner,
      support: req.body.support,
      venue: req.body.venue,
			date: req.body.date,
			rating:req.body.rating,
			review: req.body.review
		});
	} else {
		var newConcert;
		if(req.body.date != ""){
			newConcert = {
        headliner: req.body.headliner,
				support: req.body.support,
        venue: req.body.venue,
				date: req.body.date,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		} else {
			newConcert = {
				headliner: req.body.headliner,
				support: req.body.support,
        venue: req.body.venue,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		}
		new Concert(newConcert)
			.save()
			.then(concert => {
				req.flash('success_msg', "Concert added.");
				res.redirect('/concerts');
			})
	}
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res)=> {
	Concert.findOne({
		_id: req.params.id
	})
	.then(concert => {
		//new values
		concert.headliner = req.body.headliner;
		concert.support = req.body.support;
    concert.venue = req.body.venue;
		concert.rating = req.body.rating;
		concert.review = req.body.review;
		if(req.body.date != ""){
			concert.date = req.body.date;
		}
		concert.save()
			.then(concert => {
				req.flash('success_msg', 'Concert updated.');
				res.redirect('/concerts');
			})
	});
});

// Delete Concert
router.delete('/:id', ensureAuthenticated, (req, res)=>{
	Concert.remove({
		_id: req.params.id
	})
	.then(()=>{
		req.flash('success_msg', 'Concert removed.');
		res.redirect('/concerts');
	})
});


module.exports = router;
