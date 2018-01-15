const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Series Model
require('../models/TVSeries');
const Series = mongoose.model('series');


// Series Index Page
router.get('/', ensureAuthenticated, (req,res)=>{
	Series.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(series => {
			res.render('series/index', {
				series: series
			});
		});
})

// Add Series Form
router.get('/add', ensureAuthenticated, (req, res)=>{
	res.render('series/add');
});

// Edit Series Form
router.get('/edit/:id', ensureAuthenticated, (req, res)=> {
	Series.findOne({
		_id: req.params.id
	})
	.then(series => {
    if(series.user != req.user.id){
      // this ain't your account waaaat
      res.redirect('/series');
    } else {
      res.render('series/edit', {
  			series: series
  		});
    }
	});
});


// Process Series Form
router.post('/', ensureAuthenticated, (req, res)=>{
	let errors = [];

	if(!req.body.title){
		errors.push({text: 'Please add a title.'});
	}
	if(!req.body.rating){
		errors.push({text: 'Please provide a rating.'});
	}
	if(errors.length >0){
		res.render('series/add', {
			errors: errors,
			title: req.body.title,
			season: req.body.season,
			date: req.body.date,
			rating:req.body.rating,
			review: req.body.review
		});
	} else {
		var newSeries;
		if(req.body.date != ""){
			newSeries = {
				title: req.body.title,
				season: req.body.season,
				date: req.body.date,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		} else {
			newSeries = {
				title: req.body.title,
				season: req.body.season,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		}
		new Series(newSeries)
			.save()
			.then(series => {
				req.flash('success_msg', "Series added.");
				res.redirect('/series');
			})
	}
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res)=> {
	Series.findOne({
		_id: req.params.id
	})
	.then(series => {
		//new values
		series.title = req.body.title;
		series.season = req.body.season;
		series.rating = req.body.rating;
		series.review = req.body.review;
		if(req.body.date != ""){
			series.date = req.body.date;
		}
		series.save()
			.then(series => {
				req.flash('success_msg', 'Series updated.');
				res.redirect('/series');
			})
	});
});

// Delete Series
router.delete('/:id', ensureAuthenticated, (req, res)=>{
	Series.remove({
		_id: req.params.id
	})
	.then(()=>{
		req.flash('success_msg', 'Series removed.');
		res.redirect('/series');
	})
});


module.exports = router;
