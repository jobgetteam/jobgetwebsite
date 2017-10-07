
var mongoose = require('mongoose');  
var SubsSchema = new mongoose.Schema({  
  name: String,
  email: String,
  address: String,
  password: String
});
SubsSchema.methods.speak = function () {
	console.log(name+" "+email+" "+address);
}
module.exports = mongoose.model('Subscriber', SubsSchema);