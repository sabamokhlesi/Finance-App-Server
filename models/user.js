const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true},
  firstName:{type:String,required:true},
  lastName:{type:String,required:true},
  password:{type: String,required: true},
  budgetInfo:{
    categories:{type:Object}
  },
  transactions: [{type: Schema.Types.ObjectId,ref:'Transaction'}]
  //  name: {type: String,required: true},
  // catrgories:[{category:{type:String,required:true},budget:{type:Number,required:true}}],
});

module.exports = mongoose.model('User', userSchema);
