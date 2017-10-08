
var mongoose = require('mongoose');  
var Comp = new mongoose.Schema({  
  name: String,
  email: String,
  address: String,
  location: {
  	type: {type:String},
  	coordinates: [Number,Number]
  },
  password: String
});
Comp.index({location: '2dsphere'})
Comp.methods.speak = function () {
	console.log(name+" "+email+" "+address);
}
Comp.statics.search = function(search,callback) {
		
}
module.exports = mongoose.model('Company', Comp);