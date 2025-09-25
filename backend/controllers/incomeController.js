import User from "../models/Users.js";
import Income from "../models/Income.js";
import xlsx from "xlsx";

export const addIncome = async (req,res)=>{
    const userId = req.user.id;
    try{
        const {icon,amount,source,date} = req.body;
        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields required"});
        }
        const newIncome = new Income({
            user:userId,
            icon,
            amount,
            source,
            date:new Date(date)
        })
        await newIncome.save();
        res.status(200).json(newIncome);
    }catch(err){
        res.status(500).json({message:"server error"});
    }
}


export const getAllIncome = async (req,res)=>{
    const userId = req.user.id;
    const { year, month, page = 1, limit = 0 } = req.query;
    try {
        const filter = { user: userId };
        if (year) {
            const start = new Date(year, 0, 1);
            const end = new Date(year, 11, 31, 23, 59, 59);
            filter.date = { $gte: start, $lte: end };
        }   
        // If both year & month provided
        if (year && month) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59); // last day of month
            filter.date = { $gte: start, $lte: end };
        }
        const total = await Income.countDocuments(filter);
        // Paginate
        const income = await Income.find(filter)    
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            income
        });
    } catch (err) { 
        res.status(500).json({ message: "server error" });
    }
}


export const deleteIncome = async(req,res)=>{
    const userId = req.user.id;
    try{
        const income = await Income.findOneAndDelete({
            _id:req.params.id,
            user:userId
        }); 
        if(!income){
            return res.status(404).json({message:"Income not found"});
        }
        res.status(200).json({message:"Income deleted"});
    }catch(err){
        res.status(500).json({message:"server error"});
    }
}

export const downloadIncome = async (req,res)=>{
    const userId = req.user.id;
    try{
        const income = await Income.find({user:userId}).sort({date:-1});

        const data = income.map((item)=>({
            Source : item.source,
            Amount : item.amount,
            Date : item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Income");
        xlsx.writeFile(wb,'income_details.xlsx');
        res.download('income_details.xlsx');
    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
}
