//utility function to complete sensor write operation
var mongoose = require('mongoose');
var sensor_type=require('../models/sensor_type');
var sensor=require('../models/sensor_new');
var sensor_device=require('../models/sensor_device');
var device_user = require('../models/device_user');
var device = require('../models/device');
var dataStore = mongoose.model('dataSchemaDemo');
var write=require('./device').write; //write apiin device.js
/* ---------------------------function for sensor write----------------------*/
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.sensorWrite=function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
	//console.log(req.payload._id+" my user id");
    if(!req.params.sensor_id || !req.params.data)
		return sendJSONresponse(res,400,{message:'please provide sensor id/data'});
	
	sensor_device.findOne({sensor_id:req.params.sensor_id},function(err,sen)
	{
		if(err)
		return sendJSONresponse(res,500,err);
		else if(sen==null)
			return sendJSONresponse(res,404,{err:"invalid sensor id"});

		var data=req.params.data;
		//variable to define the state of device as per data sent by sensor
		var state=0; 
	//console.log(req.body.device_id+" yaha hu mai");
        if(data>sen.threshold_stop) //state=0
		{
    		/*console.log('i am here 1');*/
			state=0;
		}
		else if(data<sen.threshold_start) //state=1
		{
			console.log('i am here');
			state=1;
 		}
 		device.update({_id : req.body.device_id}, {$set: {state: state}}, function(err, done){
                if(err)
                {
                    res.status(401).json({"message":err});
                }
                console.log(done);
                newData = new dataStore();
                newData.state = state;
                newData.device_id=req.params.device_id;
               // newData.updated_by = req.payload._id;
                newData.updated_at=Date.now();
                newData.save(function(err){
                    if(err)
                    {
                        res.status(401).json({"message":err+" Data Storage "});
                    }
                    else
                    {
                        res.status(200).json({"message": "Updated Successfully"});
                    }
                });
                    });
	})
}

