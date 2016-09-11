/*var mongoose = require('mongoose');

console.log("Attempting antyhing to do with mongoose"); //shown

var db = mongoose.connection;
db.on('error',console.error.bind(console,'db connection error:')); //not shown
db.once('open',function(){
    console.log("Successful connection to db!"); //not shown
});

mongoose.connect('mongodb://localhost:27017/local',function(err){
    console.log("some kinda connection made"); //not shown
    if(err)
    {
        console.log("err: "+err);
    }
});


var HostSchema = new mongoose.Schema({
    name: String,
    LocalIP: String,
    ExternalIP: String
});

module.exports = mongoose.model('GameHost',HostSchema);
*/


