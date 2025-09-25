// import Users from '../models';
import mongoose from "mongoose";
import Expense from '../models/Expense.js';
import Income from "../models/Income.js";
import { isValidObjectId,Types } from 'mongoose';

export const getDashBoardData = async (req,res)=>{
    try{
        const userId = req.user.id;
        const UserObjectId = new Types.ObjectId(String(userId));
        const now = new Date();
        const year = req.query.year || now.getFullYear();
        const month = req.query.month || now.getMonth() + 1; // 1-based

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const totalIncome = await Income.aggregate([
            { $match: { user: UserObjectId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalExpense = await Expense.aggregate([
            { $match: { user: UserObjectId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
            const income = totalIncome.length > 0 ? totalIncome[0].total : 0;
            const expenses = totalExpense.length > 0 ? totalExpense[0].total : 0;
            const savings = income - expenses;

        res.json({
                income,
                expenses,
                savings,
        });
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month,limit } = req.query;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const recentExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .sort({ date: -1 })
      .limit(limit);

    const recentIncome = await Income.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .sort({ date: -1 })
      .limit(5);

    res.json({ recentExpenses, recentIncome });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getYearlyData = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = new Date().getFullYear();

    // Expenses grouped by month
    const monthlyExpenses = await Expense.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          date: { 
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31) 
          }
        }
      },
      { 
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.json(monthlyExpenses); // ex: [ { _id: { month: 1 }, total: 5000 }, ... ]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
