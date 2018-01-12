const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PlaySchema = new Schema({
  title:{
    type: String,
    required: true
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

mongoose.model('plays', PlaySchema);
