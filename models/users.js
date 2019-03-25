var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
    title:String,
    message: String,
    timeStamp:{type:Date,default:Date.now()}
});

var UserSchema = mongoose.Schema({
    userName: String,
    passWord: String,
    isAdmin:{type:Boolean,default:false},
    messages:[MessageSchema]
});

var User = mongoose.model('user', UserSchema);
module.exports = User;

