import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    icon :{
        type: String,
    },
    amount:{
        type:Number,
        required : true,
    },  
    purpose: {
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;