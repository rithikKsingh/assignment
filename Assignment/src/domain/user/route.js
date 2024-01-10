const express=require("express");
const router=express.Router();
const {createNewUser,authenticateUser}=require("./controller")
const auth=require("../../middleware/auth")
const {sendVerificationOTPEmail}=require("./../email_verification/controller")
const User=require("./model");

router.get("/",async (req,res)=>{
    let users=await User.find();
    return res.json(users);
})

router.post("/login",async(req,res)=>{
    try {
       let {email,password}=req.body;
       email=email.trim();
       password=password.trim(); 
       if(!(email&&password)){
        throw Error("Empty credentials supplied")
       }

       const authUser=await authenticateUser({email,password})
    res.status(200).json(authUser);
    } catch (error) {
        res.status(400).json(error.message);
    }
})

router.post("/signup",async(req,res)=>{
    try{
      let {name,email,password}=req.body;
      name = name ? name.trim() : '';
      email = email ? email.trim() : '';
      password = password ? password.trim() : '';
       if(!(name&&email&&password)){
        throw Error("Empty input fields");
       }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        throw Error("Invalid email")
       }else if(password.length<8){
        throw Error("Password is too short!")
       }else{
           const newUser=await createNewUser({
            name,
            email,
            password
           });
           
           await sendVerificationOTPEmail(email);
           res.status(200).json(newUser);
       }
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=router;