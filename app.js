const express = require("express")
const mongoose = require("mongoose")
const cors= require("cors")
const bcrypt = require("bcryptjs")

const {blogmodel}=require("./models/blog")

mongoose.connect("mongodb+srv://amjath:itsArkingtime7@cluster0.n01k0zd.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const app=express()
app.use(cors())
app.use(express.json())


const generatehashedPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedpassword = await generatehashedPassword(input.password) 
    console.log(hashedpassword)
    input.password = hashedpassword
    let blog=new blogmodel(input)
    blog.save()


    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("server runnin")
})