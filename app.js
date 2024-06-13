const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const { blogmodel } = require("./models/blog")

mongoose.connect("mongodb+srv://amjath:itsArkingtime7@cluster0.n01k0zd.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())


const generatehashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedpassword = await generatehashedPassword(input.password)
    console.log(hashedpassword)
    input.password = hashedpassword
    let blog = new blogmodel(input)
    blog.save()

    res.json({ "status": "success" })
})

app.post("/signin", (req, res) => {
    let input = req.body
    blogmodel.find({ "emailId": req.body.emailId }).then(
        (response) => {
            if (response.length > 0) {
                let dbpassword = response[0].password
                console.log(dbpassword)
                bcrypt.compare(input.password, dbpassword, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ emailId: input.emailId }, "blog-app", { expiresIn: "1d" },
                            (error, token) => {
                                if (error) {
                                    res.json({ "status": "unable to create token" })
                                } else {
                                    res.json({ "status": "success", "userid": response[0]._id, "token": token })

                                }
                            }
                        )

                    } else {
                        res.json({ "status": "Incorrect" })
                    }
                })

            } else {
                res.json({ "status": "user not found" })
            }
        }
    ).catch()
})


app.listen(8080, () => {
    console.log("server running")
})