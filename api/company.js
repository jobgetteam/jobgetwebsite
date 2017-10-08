
var mongoose = require('mongoose');  
var CompSchema = new mongoose.Schema({  
  name: String,
  email: String,
  address: String,
  password: String
});
CompSchema.methods.speak = function () {
	console.log(name+" "+email+" "+address);
}
module.exports = mongoose.model('Company', CompSchema);