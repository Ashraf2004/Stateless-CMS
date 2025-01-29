const fs = require("fs");
const path = require("path");
const {v4 : uuidv4} = require("uuid");


const userPolicyFilePath = path.join(__dirname, "../database/userPolicy.json");
const policyFilePath = path.join(__dirname,"../database/policy.json");

const applyPolicy = async (req,res) => {
    try{
    const data = JSON.parse(fs.readFileSync(userPolicyFilePath,"utf-8"));
    const data1 = JSON.parse(fs.readFileSync(policyFilePath,"utf-8"));
    const newRecord = {id:uuidv4(),...req.body};
    
    const getPolicy = data1.findIndex((ele) => ele.policyId===newRecord.policyId);
    if(getPolicy===-1){
        res.status(404).json({message : "Policy not found"});
    }
    else{
    const getRecord = data.findIndex((ele) => ele.policyId===newRecord.policyId && ele.userId===newRecord.userId);
    if (getRecord!==-1) {
        res.status(409).json({message : `User with ID ${newRecord.userId} has already applied for the policy`});
    }
    else {
        const newdata = [newRecord,...data];
        const result = fs.writeFileSync(userPolicyFilePath,JSON.stringify(newdata));
        res.status(201).json({message : `Policy applied Successfully`});
    }
    }
    }
    catch(Err){
        res.status(404).json({message:`Error Occurred : ${Err}`});
    }
}

const modifyPolicy = async (req,res) => {
    try{
        const data = JSON.parse(fs.readFileSync(userPolicyFilePath,"utf-8"));
        const getRecord = data.findIndex((ele) => ele.id===req.body.id);
        if(getRecord===-1){
            res.status(404).json({message:"No user applied for policy with given ID"});
        }
        else{
            data[getRecord] = {...data[getRecord],...req.body};
            const newdata = data;
            const result = fs.writeFileSync(userPolicyFilePath,JSON.stringify(newdata));
            res.status(200).json({message:`The policy has ${req.body.status} Successfully`});
        }
        }
        catch(Err){
            res.status(404).json({message:`Error Occurred : ${Err}`});
        }
}

module.exports = {applyPolicy, modifyPolicy};