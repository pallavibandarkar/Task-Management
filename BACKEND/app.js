if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require("./routes/user.js");
const taskRouter = require("./routes/task.js");
const cors = require('cors')

const dburl = process.env.ATLAS_URL;
main().then(()=>{
    console.log("Connected to Atlas db successfully!!!");
})
.catch(()=>{
    console.log("oops!Something went wrong!!!");
})
async function main() {
    await mongoose.connect(dburl)
}


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use('/user',userRouter)
app.use('/task',taskRouter)

app.listen(8080,()=>{
    console.log("Listening on port 8080!!");
})