import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from './routes/auth.js';
import incomeRoutes from "./routes/income.js";
import expenseRoutes from "./routes/expense.js";
import dashboardRoutes from "./routes/dashboard.js";
import voiceCommandRoutes from "./routes/voiceCommand.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users",userRoutes);
app.use('/api/expense',expenseRoutes);
app.use("/api/income",incomeRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/voice",voiceCommandRoutes);

connectDB();

app.listen(PORT,()=>{
    console.log(`Server started: ${PORT}`);
})
