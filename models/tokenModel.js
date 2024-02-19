const mongoose = require('mongoose');
var tokenModelSchema=mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    token:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"         //take from userModel last line- 
                                 //usermodel primary key is foreign key in tokenmodel
    }
})
module.exports=mongoose.model("tokenModel",tokenModelSchema);