import express from "express";
import User from "../models/Users.js";
import {generate_token} from "../utils/generateToken.js";

//register route controller
export const registerUser = async (req,res)=>{
    const {username,email,password} = req.body;

    try{
        if(!username || !email || !password){
            return res.status(400).json({message: "Please fill the fields"});
        }
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message: "User already Exists"});
        }
        const user = await User.create({username,email,password});
        res.status(201).json(
                {id : user._id,
                name:user.username,
                email:user.email,
                token:generate_token(user._id)
                }
            )
    }catch(error){
        console.error("register error:",error);
         res.status(500).json({message:"server error"});
    }
}

//login route controller
export const loginUser = async (req,res)=>{
    const {email,password} = req.body;

    try{
        if(!email || !password){
            return res.status(400).json({message: "Please fill the fields"});
        }

        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            return res.status(400).json({message: "Invalid login credentials!"});
        }
        res.status(200).json(
                {id : user._id,
                username:user.username,
                email:user.email,
                monthlyBudget:user.monthlyBudget,
                token:generate_token(user._id)
                }
            )
    }
    catch(err){
         res.status(500).json({message:"server error"});
    }
}

// user route constroller

export const me= async (req,res)=>{
     res.status(200).json(req.user);


}
