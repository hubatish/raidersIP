var express = require('express');

var router = express.Router();

//import models/schema
var GameHost = require('./app/models/host');

router.get('/',function(req,res){
    res.json({message:'hoorary! welcome to our api!'});
});

router.route('/host')
    //create a host
    .post(function(req,res) {
        console.log("Beging processing a POST Host request");
        /*var host = new GameHost();
        host.name = req.body.name;
        console.log("Made a host: "+ host);
        host.save(function(err){
            console.log("Saved that host");
            if(err)
                res.send(err);
            res.json({message: "Host created!"});
        });*/
        var newHost = {
            name:req.body.name,
            internalIP:req.body.internalIP,
            externalIP:req.body.externalIP
        };
        GameHost.createHost(newHost,function(err){
            if(err){
                console.log("error adding",err);
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true,message:"Host created"});
            }
        });
    })
    //Get all the hosts (for debugging)
    .get(function(req,res){
        console.log("Starting to get all the hosts");
        GameHost.getAllHosts(function(err,hosts){
            if(err)
                res.send(err);
            res.json(hosts);
        });
    });

module.exports = router;
//register routes
//app.use('/',router);

