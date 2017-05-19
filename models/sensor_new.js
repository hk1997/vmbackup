var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//sensor schema to be used
var sensor_schema=new Schema(
{
	admin:String,
	type:String //foreign key to sensor_type
})

module.exports=mongoose.model('sensor_new',sensor_schema); //updated module of sensor