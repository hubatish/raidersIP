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
        var host = new GameHost();
        host.name = req.body.name;
        console.log("Made a host: "+ host);
        host.save(function(err){
            console.log("Saved that host");
            if(err)
                res.send(err);
            res.json({message: "Host created!"});
        });
    });

module.exports = router;
//register routes
//app.use('/',router);

