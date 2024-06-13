const mongoose = require("mongoose")
const schema = mongoose.Schema(

    {
        "name":{type:String,required:true},
        "emailId":{type:String,required:true},
        "password":{type:String,required:true}
    }
)

let blogmodel = mongoose.model("users",schema)
module.exports={blogmodel}