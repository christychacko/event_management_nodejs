const mongoose = require('mongoose');
var eventModelSchema=mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    eventName:{
        type:String
    },
    from:{
        type:Date
    },
    to:{
        type:Date
    },
    venue:{
        type:String
    },
    host:{
        type:String
    }

})
module.exports=mongoose.model("eventModel",eventModelSchema);