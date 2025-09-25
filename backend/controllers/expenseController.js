import User from "../models/Users.js";
import Expense from "../models/Expense.js";
import xlsx from "xlsx";

export const addExpense = async (req,res)=>{
    const userId = req.user.id;
    try{
        const {icon,amount,purpose,date} = req.body;
        if(!purpose || !amount || !date){
            return res.status(400).json({message:"All fields required"});
        }
        const newExpense = new Expense({
            user:userId,
            icon,
            amount,
            purpose,
            date:new Date(date)
        })
        await newExpense.save();
        res.status(200).json(newExpense);
    }catch(err){
        res.status(500).json({message:"server error"});
    }
}

export const getAllExpense = async (req,res)=>{
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

        const total = await Expense.countDocuments(filter);

        // Paginate
        const expenses = await Expense.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            expenses
        });
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
};



export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,           // only delete if owned by this user
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const downloadExpense = async (req,res)=>{
    const userId = req.user.id;
    try{
        const expense = await Expense.find({user:userId}).sort({date:-1});

        const data = expense.map((item)=>({
            Purpose : item.purpose,
            Amount : item.amount,
            Date : item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Expense");
        xlsx.writeFile(wb,'expense_details.xlsx');
        res.download('expense_details.xlsx');
    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
}