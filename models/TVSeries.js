const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TVSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  season:{
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

mongoose.model('series', TVSchema);
