const mongoose = require('mongoose');
var bookingModelSchema=mongoose.Schema({
    status:{
        type:String,   //_v means how much time data edited and _id comes automatically
        default:"Active"
    },
    numSeats:{
        type:Number
    },
    adult:{
        type:Number
    },
    children:{
        type:Number
    },
    name:{
        type:String
    },
    bookDate:{
        type:Date,
        default:new Date()
    },
    amount:{
        type:Number
    },
    usersId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"eventModel"         
    }

})
module.exports=mongoose.model("bookingModel",bookingModelSchema);