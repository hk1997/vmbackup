//utility function to complete sensor write operation
var mongoose = require('mongoose');
var sensor_type=require('../models/sensor_type');
var sensor=require('../models/sensor_new');
var sensor_device=require('../models/sensor_device');
var device_user = require('../models/device_user');
var device = require('../models/device');

var write=require('./device').write; //write apiin device.js
/* ---------------------------function for sensor write----------------------*/
module.exports.sensorWrite=function(req,res)
{
	console.log(req.payload._id+" my user id");
    if(!req.params.sensor_id || !req.params.data)
		return sendJSONresponse(res,400,{message:'please provide sensor id/data'});
	
	sensor_device.findOne({sensor_id:req.params.sensor_id},function(err,sen)
	{
		if(err)
		return sendJSONresponse(res,500,err);
		req.body={};//redefining body object for further passing to write
		var data=req.params.data;
		req.body.device_id=req.params.device_id;
	//console.log(req.body.device_id+" yaha hu mai");
        if(data>sen.threshold_stop) //state=0
		{
    		/*console.log('i am here 1');*/
			req.body.data=0;
            return write(req,res,0); //calling write api in device.js to complete the write operation
		}
		else if(data<sen.threshold_start) //state=1
		{
			console.log('i am here');
			req.body.data=1;
            return write(req,res,1);  //calling write api in device.js to complete the write operation
		}
	})
}

