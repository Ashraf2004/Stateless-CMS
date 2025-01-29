const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const usersFilePath = path.join(__dirname, "../database/users.json");


router.get("/", (req,res) => {
    const data = JSON.parse(fs.readFileSync(usersFilePath,"utf-8"));
    res.status(200).json({users : data});
})


router.route("/:id")
.get(async (req,res) => {
    try{
    const {id} = req.params;
    const data = JSON.parse(fs.readFileSync(usersFilePath,"utf-8"));
    const getRecord = data.findIndex(ele => ele.userId===id);
    if(getRecord!==-1){
        res.status(200).json({message : "User Found",user:data[getRecord]});
    }
    else{
        res.status(404).json({message : `User with given ID ${id} Not Found`});
    }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})
.put(async (req,res) => {
    try{
        const {id} = req.params;
        const data = JSON.parse(fs.readFileSync(usersFilePath,"utf-8"));
        const updatedData = {...req.body,userId:id};
        const getRecord = data.findIndex(ele => ele.userId===id);
        if(getRecord===-1){
            res.status(404).json({message : `User with ID ${id} Not Found`});
        }
        else{
            data[getRecord] = {...data[getRecord],...updatedData};
            const newData = data;
            const result = fs.writeFileSync(usersFilePath,JSON.stringify(newData));
            res.status(200).json({message:`User with ID ${id} updated Successfully`,user:data[getRecord]});
        }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})
.delete(async (req,res) => {
    try{
        const data = JSON.parse(fs.readFileSync(usersFilePath,"utf-8"));
        const {id} = req.params;
        const getRecord = data.findIndex(ele => ele.userId === id);
        if(getRecord===-1){
            res.status(404).json({message : `User with ID ${id} Not Found`});
        }
        else{
            const newdata = data.filter((ele) => ele.userId!==id);
            const result = fs.writeFileSync(usersFilePath,JSON.stringify(newdata));
            res.status(200).json({message : `User with ID ${id} deleted Successfully`});
        }
    }
    catch(Err){
        res.status(404).json({message : `Error Occurred : ${Err}`});
    }
})

module.exports = router;