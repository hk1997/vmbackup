//utility function to complete sensor write operation
var mongoose = require('mongoose');
var sensor_type=require('../models/sensor_type');
var sensor=require('../models/sensor_new');
var sensor_device=require('../models/sensor_device');
var device_user = require('../models/device_user');
var device = require('../models/device');
var dataStore = mongoose.model('dataSchemaDemo');
var write=require('./device').write;
/* ---------------------------function for sensor write----------------------*/
module.exports.sensorWrite=function(req,res)
{
	/*console.log('yhi humai');*/
    if(!req.body.sensor_id || !req.body.data)
		return sendJSONresponse(res,400,{message:'please provide sensor id/data'});
	
	sensor_device.findOne({sensor_id:req.body.sensor_id},function(err,sen)
	{
		if(err)
		return sendJSONresponse(res,500,err);

		var data=req.body.data;
	/*	console.log('yhi humai 2');*/
        if(data>sen.threshold_stop) //state=0
		{
    		/*console.log('i am here 1');*/
			req.data=0;
            return write(req,res,0); //calling sensorWriteUtil to complete the operation
		}
		else if(data<sen.threshold_start) //state=1
		{
			console.log('i am here');
			req.data=1;
            return write(req,res,1);  //calling sensorWriteUtilto complete the write operation
		}
	})
}


/*------utility function to complete objective of sensorWrite -----------*/
/*var sensorWriteUtil=function(req,res,data)
{
    res.header("Access-Control-Allow-Origin", "*");
    var t = data;
    console.log(req.payload._id);
    device_user.find({user_id:req.payload._id, device_id:req.body.device_id}, function (err, result){

            if(err)
            {
                console.log(err);
                 res.status(401).json({"message":err});
            }

            else if(!result.length)
            {
                console.log("User does not have the rights to access the device");
                res.status(403).json({"message":"User does not have the rights to access the device"});
            }
            
            else {
                //console.log("Yahan AAya");
                console.log(result.device_id);

                device.update({_id : req.body.device_id}, {$set: {state: t}}, function(err, done){
                if(err)
                {
                    res.status(401).json({"message":err});
                }
                console.log(done);
                newData = new dataStore();
                newData.state = t;
                newData.device_id=req.body.device_id;
                newData.updated_by = req.payload._id;
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
        }
    }); 
    
     
}
*/