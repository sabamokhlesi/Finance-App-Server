const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true},
  password:{type: String,required: true},
  savingGoal:{type:Number,required:true},
  totalBudget:{type:Number,required:true},
  totalEarning:{type:Number,required:true},
//   name: {type: String,required: true},
  catrgories:[{category:{type:String,required:true},budget:{type:Number,required:true}}],
  transactions: [{type: Schema.Types.ObjectId,ref: 'Transaction'}]
});

module.exports = mongoose.model('User', userSchema);
