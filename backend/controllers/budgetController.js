import express from "express";
import User from "../models/Users.js";

export const updatemonthlyBudget = async (req,res)=>{
    try{
        const {monthlyBudget} = req.body;
        const userId = req.user.id; //auth middleWare
        const user = await User.findByIdAndUpdate(userId , {monthlyBudget},{new:true});
        res.status(200).json({message:"monthly Budget updated",user});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

export const getMonthlyBudget = async (req,res)=>{
    try{
        const userId = req.user.id;
        const user =await User.findById(userId);
        if(!user){
           return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({monthlyBudget:user.monthlyBudget});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
