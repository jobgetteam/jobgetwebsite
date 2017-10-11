const mongoose = require('mongoose');  
const Schema = mongoose.Schema;

const SubsSchema = new Schema({  
  name: String,
  email: String,
  address: String,
  password: String
});
SubsSchema.methods.speak = function () {
	console.log(name+" "+email+" "+address);
}
module.exports = mongoose.model('Subscriber', SubsSchema);