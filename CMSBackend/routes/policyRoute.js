const express = require("express");
const fs = require("fs");
const path = require("path");
const {v4 : uuidv4} = require("uuid");

const policyFilePath = path.join("__dirname","../database/policy.json");

const router = express.Router();

router.get("/", (req,res) => {
    const data = JSON.parse(fs.readFileSync(policyFilePath,"utf-8"));
    res.status(200).json({policies : data});
})

router.post("/", async (req,res) => {
    try{
        const data = JSON.parse(fs.readFileSync(policyFilePath,"utf-8"));
        const newRecord = {policyId:uuidv4(),...req.body}
        const newdata = [newRecord,...data];
        const result = fs.writeFileSync(policyFilePath,JSON.stringify(newdata));
        res.status(200).json({message : "Policy added Successfully",policyId:newRecord.policyId});
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})

router.route("/:id")
.get(async (req,res) => {
    try{
    const {id} = req.params;
    const data = JSON.parse(fs.readFileSync(policyFilePath,"utf-8"));
    const record = data.filter((ele) => ele.policyId===id)[0];
    if(record){
        res.status(200).json({message : "Policy Found",policy:record});
    }
    else{
        res.status(404).json({message : "Policy Not Found"});
    }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})
.put(async (req,res) => {
    try{
        const {id} = req.params;
        const data = JSON.parse(fs.readFileSync(policyFilePath,"utf-8"));
        const updatedData = {...req.body,policyId:id};
        const getRecord = data.findIndex(ele => ele.policyId===id);
        if(getRecord===-1){
            res.status(404).json({message : `Policy with ID ${id} Not Found`});
        }
        else{
            data[getRecord] = {...data[getRecord],...updatedData};
            const newData = data;
            const result = fs.writeFileSync(policyFilePath,JSON.stringify(newData));
            res.status(200).json({message:`Policy with ID ${id} updated Successfully`,policy:data[getRecord]});
        }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})
.delete(async (req,res) => {
    try{
        const data = JSON.parse(fs.readFileSync(policyFilePath,"utf-8"));
        const {id} = req.params;
        const getRecord = data.findIndex(ele => ele.policyId === id);
        if(getRecord===-1){
            res.status(404).json({message : `Policy with ID ${id} Not Found`});
        }
        else{
            const newdata = data.filter((ele) => ele.policyId!==id);
            const result = fs.writeFileSync(policyFilePath,JSON.stringify(newdata));
            res.status(200).json({message : `Policy with ID ${id} deleted Successfully`});
        }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})


module.exports = router;