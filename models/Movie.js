const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const MovieSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  releaseYear:{
    type: Number
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

mongoose.model('movies', MovieSchema);
