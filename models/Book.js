const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const BookSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  rating:{
    type: Number,
    required: true
  },
  review:{
    type: String
  },
  user:{
    type: String,
    required: true
  }
});

mongoose.model('books', BookSchema);
