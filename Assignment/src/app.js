require("./config/db");
const express=require("express");
const bodyParser=express.json;
const cors=require("cors");
const routes=require("./routes")

const app=express();

app.use(cors());
app.use(bodyParser());
app.use(routes);
module.exports=app;