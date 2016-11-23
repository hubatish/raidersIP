var express = require('express');

var router = express.Router();

//import models/schema
var GameHost = require('./app/models/host');

router.get('/',function(req,res){
    res.json({message:'hoorary! welcome to our api!'});
});

//Safer but longer than any of these
//http://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
var getExternalIP = function(req){
    return req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
}

router.route('/host')
    //create a host
    .post(function(req,res) {
        console.log("Begining processing a POST Host request");
        var newHost = {
            internalIP:req.body.internalIP,
            externalIP:getExternalIP(req)
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
    });

router.route('/host/all')
    //Get all the hosts (for debugging)
    .get(function(req,res){
        console.log("Starting to get all the hosts");
        GameHost.getAllHosts(function(err,hosts){
            if(err)
                res.send(err);
            res.json(hosts);
        });
    });

router.route('/host/myIP')
    //get some internalIPs matching the external
    .get(function(req,res){
        var extIP = getExternalIP(req);
        GameHost.getInternalIPs(extIP,function(err,ips){
            if(err)
                res.send(err);
            res.json(ips);
        });
    });

router.route('/host/:internalIP')
    //delete host with that internal IP (and that externalIP)
    .delete(function(req,res){
        host = {
            internalIP:req.params.internalIP,
            externalIP:getExternalIP(req)
        };
        GameHost.deleteHost(host,function(err){
            if(err)
                res.send(err);
            res.json({
                success:true,
                message:('Successfully deleted for IP: '+req.params.internalIP)
            });
        });
    });

//Redirect users to appropriate download pages
var detectBrowser = require('./detectBrowser.js')
router.route('/QRCode')
    .get(function(req, res){
        var userAgent = req.headers['user-agent'];
        var os = detectBrowser.getMobileOperatingSystem(userAgent);

        var endUrl = 'http://fancierfish.net';
        switch(os){
            case 'Android': 
                endUrl = 'https://play.google.com/store/apps/details?id=com.Drexel.FancierFish.RemoteForRaiders';
                break;
            case 'iOS':
                endUrl = 'https://www.appstore.com/';
                break;
        }
        res.redirect(endUrl);
    });

module.exports = router;
//register routes
//app.use('/',router);

