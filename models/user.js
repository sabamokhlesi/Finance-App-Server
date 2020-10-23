const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true},
  password:{type: String,required: true},
  budgetInfo:{
    savingGoal:{type:Number,required:true},
    totalBudget:{type:Number,required:true},
    totalEarning:{type:Number,required:true},
    categories:{type:Object,required:true},
  },
  transactions: [{type: Schema.Types.ObjectId,ref: 'Transaction'}]
  //  name: {type: String,required: true},
  // catrgories:[{category:{type:String,required:true},budget:{type:Number,required:true}}],
});

module.exports = mongoose.model('User', userSchema);
