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
    console.log("Adding host"+newHost.internalIP);

    newHost.dateUpdated = new Date();

    collection.update(
        {
            internalIP:newHost.interntalIP,
            externalIP:newHost.externalIP
        },newHost,{upsert:true},function(err,result){
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

var minutesToExpire = 70;

//Get all Internal IPs matching an external IP
var getInternalIPs = function(externalIP,next){
    collection.find({externalIP:externalIP}).toArray(function(err,hosts){
        if(err)
            next(err);
        else{
            //filter out too old hosts
            var cutOffDate = new Date();
            cutOffDate.setMinutes(cutOffDate.getMinutes()-minutesToExpire);
            for(var i=hosts.length-1;i>=0;i-=1){
                if(hosts[i].dateUpdated < cutOffDate){
                    var host = hosts[i]; //er, playing it safe with scoping
                    deleteHost(host,function(err,result){
                        console.log("Tried to delete too old host, did err?"+err);
                    });
                    hosts.splice(i,1);
                }
            }
            next(null,hosts);
        }
    });
}

module.exports = 
{
    createHost:createHost,
    deleteHost:deleteHost,
    getAllHosts:getAllHosts,
    getInternalIPs:getInternalIPs
};

