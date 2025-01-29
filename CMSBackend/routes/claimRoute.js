const express = require("express");
const fs = require("fs");
const path = require("path");
const {v4 : uuidv4} = require("uuid");

const claimFilePath = path.join("__dirname","../database/claim.json");

const router = express.Router();

router.get("/", (req,res) => {
    const data = JSON.parse(fs.readFileSync(claimFilePath,"utf-8"));
    res.status(200).json({claims : data});
})

router.post("/", (req,res) => {
        try{
            const data = JSON.parse(fs.readFileSync(claimFilePath,"utf-8"));
            const newRecord = {claimId:uuidv4(),...req.body}
            const newdata = [newRecord,...data];
            const result = fs.writeFileSync(claimFilePath,JSON.stringify(newdata));
            res.status(200).json({message : "Claim added Successfully",claimId:newRecord.claimId});
        }
        catch(Err){
            res.status(404).json({message : `Error Occurred : ${Err}`});
        }
})

router.route("/:id")
.put(async (req,res) => {
    try{
        const {id} = req.params;
        const data = JSON.parse(fs.readFileSync(claimFilePath,"utf-8"));
        const updatedData = {...req.body,claimId:id};
        const getRecord = data.findIndex(ele => ele.claimId===id);
        if(getRecord===-1){
            res.status(404).json({message : `Claim with ID ${id} Not Found`});
        }
        else{
            data[getRecord] = {...data[getRecord],...updatedData};
            const newData = data;
            const result = fs.writeFileSync(claimFilePath,JSON.stringify(newData));
            res.status(200).json({message:`Claim with ID ${id} updated Successfully`,claim:data[getRecord]});
        }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})



module.exports = router;