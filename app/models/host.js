var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/host";

//Go Ahead and connect & sketchily initialize the db
var db; 
var collection;
//const werewolfCollection;
MongoClient.connect(url,function(err,database){
    if(err){
        console.log("Coudln't connect to mongo. Error"+err);
    } else{
        db = database;
        collection = db.collection('hosts');
        //werewolfCollection = db.collection('werewolves');
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

// Below code experimental for werewolf game:
const CharacterRole = {
    WEREWOLF: 0,
    VILLAGER: 1,
};

// let's just have state - I think it works & there's only one server.
let namesForId = {};
let rolesForId = {};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const joinGame = function(player, next) {
    namesForId[player.id] = player.name;
    next(null);
}

const startGame = function(next) {
    Object.keys(namesForId).forEach((id) => {
        rolesForId[id] = getRandomInt(0, 3) == 0 ? CharacterRole.WEREWOLF : CharacterRole.VILLAGER;
    });
    next(null);
}

const getPlayerRole = function(id, next) {
    if (rolesForId[id] == undefined) {
        next("Role doesn't exist for id",-1);
    } else {
        next(null, rolesForId[id]);        
    }
}

module.exports = 
{
    createHost:createHost,
    deleteHost:deleteHost,
    getAllHosts:getAllHosts,
    getInternalIPs:getInternalIPs,
    joinGame,
    getPlayerRole,
    startGame,
};

