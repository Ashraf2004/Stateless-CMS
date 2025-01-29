const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");

const usersFilePath = path.join(__dirname, "../database/users.json");
const data = JSON.parse(fs.readFileSync(usersFilePath,"utf-8"));

const loginRoute = async (req,res) => {
    try{
    const {emailId,password,role} = req.body;
    const result1 = data.filter((ele) => ele.emailId===emailId)[0];
    if(!result1){
        res.status(404).json({"message" : "User with given email id does not exist"});
    }
    else if(result1.role!==role){
        res.status(401).json({"message" : "You are not authorized to access this route"});
    }
    else{
        const result2 = await bcrypt.compare(password,result1.password);
        if(result2){
            const payload = {emailId,role};
            const jwtToken = jwt.sign(payload,"alsdfjl;asejglejksjeg");
            res.status(200).json({"message" : "Login Successful!!!",token:jwtToken});
        }
        else{
            res.status(401).json({"message" : "Your password is incorrect"});
        }
    }
    }
    catch(Err){
        res.status(404).json({message : "Error Occurred"});
    }
}

module.exports = {loginRoute};