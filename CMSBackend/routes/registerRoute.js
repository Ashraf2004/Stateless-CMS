const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");
const {v4 : uuidv4} = require("uuid");


const usersFilePath = path.join(__dirname, "../database/users.json");

const registerRoute = async (req,res) => {
    try{
        const data = JSON.parse(fs.readFileSync(usersFilePath,"utf-8"));
        const {emailId} = req.body;
        if(emailId){
            const getRecord = data.findIndex((ele) => ele.emailId===emailId);
            if(getRecord!==-1){
                res.status(409).json({message : `User with email ID ${emailId} already exists`});
            }
            else{
                const {password} = req.body;
                const hashedPassword = await bcrypt.hash(password,10);
                const newItem = {userId:uuidv4(),...req.body,password:hashedPassword};
                const newdata = [newItem,...data];
                const result = fs.writeFileSync(usersFilePath,JSON.stringify(newdata));
                res.status(200).json({message : "User added Successfully",user:newItem});
            }
        }
    }
    catch(Err){
        res.status(404).json({message : "Error Occurred"});
    }
}


module.exports = {registerRoute};