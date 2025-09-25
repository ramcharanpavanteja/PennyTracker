import User from "../models/Users.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

export const addVoiceCommand = async (req, res) => {
    const { text } = req.body;
    const userId = req.user._id;
    // Simple rule-based parser (can later replace with AI if needed)
    const lower = text.toLowerCase();
    try {
        if (lower.includes("expense")) {
            const amount = parseInt(text.match(/\d+/)?.[0] || 0);       
            const purpose = text.replace(/add|expense|expenses|\d+/gi, "").trim();
            const saved = await Expense.create({ user: userId, amount, purpose, date: new Date() });
            return res.json({ type: "expense", savedDoc: saved, message: "Expense saved!" });
        }           
        if (lower.includes("income")) {
            const amount = parseInt(text.match(/\d+/)?.[0] || 0);       
            const source = text.replace(/add|income|\d+/gi, "").trim();     
            const saved = await Income.create({ user: userId, amount, source, date: new Date() });
            return res.json({ type: "income", savedDoc: saved, message: "Income saved!" });
        }   
        if (lower.includes("budget")) {
            const amount = parseInt(text.match(/\d+/)?.[0] || 0);       
            const user = await User.findByIdAndUpdate(userId , {monthlyBudget:amount},{new:true});
            return res.json({ type: "budget", savedDoc: user, message: "Budget updated!" });
        }
        return res.status(400).json({ message: "Could not understand command" });
    } catch (e) {
        res.status(500).json({ message: "Failed to save", error: e.message });
    }   
};  

