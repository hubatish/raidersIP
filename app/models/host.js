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

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/host";

//Go Ahead and connect & sketchily initialize the db
var db; 
var collection;
MongoClient.connect(url,function(err,database){
    if(err){
        console.log("Coudln't connect to mongo. Error"+err);
    } else{
        db = database;
        collection = db.collection('hosts');
        console.log("Connected to mongo, db good to go");
    }
});

var createHost = function(newHost,next){
    console.log("Er, what is global db? "+db);
    console.log("Adding host");

    collection.update({internalIP:newHost.interntalIP,externalIP:newHost.externalIP},newHost,{upsert:true},function(err,result){
        if(err)
            next(err);
        else{
            console.log("Successful insert.");
            next(null,result);
        }
    });
}

var deleteHost = function(host,next){
    collection.remove(
        {internalIP:host.internalIP,externalIP:host.externalIP},
    function(err,result){
        if(err)
            next(err);
        else
            next(null,result);
    });
}

var getAllHosts = function(next){
    var hostCursor = collection.find();
    hostCursor.toArray(function(err,allHosts){
        if(err)
            next(err);
        else{
            console.log("Number of hosts: "+allHosts.length);
            next(null,allHosts);
        }
    });
}

module.exports = 
{
    createHost:createHost,
    deleteHost:deleteHost,
    getAllHosts:getAllHosts
};

