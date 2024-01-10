const app=require("./app");
const PORT=3000;

const startApp=()=>{
    app.listen(PORT,()=>{
        console.log(`server started running on port : ${PORT}`)
    });

};

startApp();