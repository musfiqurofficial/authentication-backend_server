const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require('dotenv').config()
const app = express();
const User = require("./models/user.model")

const dbURL = process.env.MONGO_URL;

mongoose.connect(dbURL)
    .then(() => {
        console.log("DB is connected!");
    })
    .catch((err) => {
        console.log("Connection Problem!");
        process.exit(1);
    })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const newUser = new User(req.body)
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (user && user.password === password) {
            res.status(200).json({ status: "valid user!" })
        } else {
            res.status(404).json({ status: "not valid user!" })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
})




app.get("/", (req, res) => {
    res.send("<h2>Hello home page</h2>")
})
//router not found error
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found!"
    });
});

//handling server error 
app.use((err, req, res, next) => {
    res.status(500).json({
        message: "something is wrong!"
    })
})

const port = process.env.PORT || 5001
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})