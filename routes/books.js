const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Book Model
require('../models/Book');
const Book = mongoose.model('books');


// Book Index Page
router.get('/', ensureAuthenticated, (req,res)=>{
	Book.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(books => {
			res.render('books/index', {
				books: books
			});
		});
})

// Add Book Form
router.get('/add', ensureAuthenticated, (req, res)=>{
	res.render('books/add');
});

// Edit Book Form
router.get('/edit/:id', ensureAuthenticated, (req, res)=> {
	Book.findOne({
		_id: req.params.id
	})
	.then(book => {
    if(book.user != req.user.id){
      // this ain't your account waaaat
      res.redirect('/books');
    } else {
      res.render('books/edit', {
  			book: book
  		});
    }
	});
});


// Process Book Form
router.post('/', ensureAuthenticated, (req, res)=>{
	let errors = [];

	if(!req.body.title){
		errors.push({text: 'Please add a title.'});
	}
	if(!req.body.rating){
		errors.push({text: 'Please provide a rating.'});
	}
	if(errors.length >0){
		res.render('books/add', {
			errors: errors,
			title: req.body.title,
			author: req.body.author,
			date: req.body.date,
			rating:req.body.rating,
			review: req.body.review
		});
	} else {
		var newBook;
		if(req.body.date != ""){
			newBook = {
				title: req.body.title,
				author: req.body.author,
				date: req.body.date,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		} else {
			newBook = {
				title: req.body.title,
				author: req.body.author,
				rating:req.body.rating,
				review: req.body.review,
	      user: req.user.id
			}
		}
		new Book(newBook)
			.save()
			.then(book => {
				req.flash('success_msg', "Book added.");
				res.redirect('/books');
			})
	}
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res)=> {
	Book.findOne({
		_id: req.params.id
	})
	.then(book => {
		//new values
		book.title = req.body.title;
		book.author = req.body.author;
		book.rating = req.body.rating;
		book.review = req.body.review;
		if(req.body.date != ""){
			book.date = req.body.date;
		}
		book.save()
			.then(book => {
				req.flash('success_msg', 'Book updated.');
				res.redirect('/books');
			})
	});
});

// Delete Book
router.delete('/:id', ensureAuthenticated, (req, res)=>{
	Book.remove({
		_id: req.params.id
	})
	.then(()=>{
		req.flash('success_msg', 'Book removed.');
		res.redirect('/books');
	})
});


module.exports = router;
