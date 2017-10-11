
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
//Comp.index({location: '2dsphere'})
Comp.methods.speak = function () {
	console.log(name+" "+email+" "+address);
}
Comp.statics.search = function(search,callback) {
    var qry = this.find();
    if (search.types) {
        qry.where('type').in(search.types);
    }
    if (search.loc) {
        qry.where('loc').near({
            center: search.loc,
            maxDistance: search.distance * 1000
        });
    }
    qry.exec(cb);
}
module.exports = mongoose.model('Company', Comp);