const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ConcertSchema = new Schema({
  headliner:{
    type: String,
    required: true
  },
  support:{
    type: String
  },
  venue:{
    type: String
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

mongoose.model('concerts', ConcertSchema);
