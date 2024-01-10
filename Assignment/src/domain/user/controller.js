const User=require("./model");
const {hashData,verifyHashedData}=require('../../util/hashData')
const createToken=require("./../../util/createToken")
const authenticateUser=async(data)=>{
    try{
       const {email,password}=data;
       const fetchedUser=await User.findOne({email});
       if(!fetchedUser){
        throw Error("Invalid credentials")
       }
       if(!fetchedUser.verified){
        throw Error("Email hasnt been verified yet.Check your inbox")
       }

       const hashedPassword=fetchedUser.password;
       const passwordMatch= await verifyHashedData(password,hashedPassword)
       if(!passwordMatch){
        throw error("Invalid password enterd")
       }  

       //create user token
      const tokenData={userId:fetchedUser._id,email};
      const token=await createToken(tokenData);

      fetchedUser.token=token;
      return fetchedUser;
    }catch(err){
        throw err;
    }
}

const createNewUser=async(data)=>{
try{
    const {name,email,password}=data;
    const existingUser=await User.findOne({email});
    if(existingUser){
        throw Error("User already exist")
    }
    const hashedPassword=await hashData(password);
    const newUser=new User({
        name,
        email,
        password:hashedPassword
    });

    const createdUser=await newUser.save();
    return createdUser;
}catch(err){
    throw err;
    console.log(err.message);
}
};

module.exports={createNewUser,authenticateUser}