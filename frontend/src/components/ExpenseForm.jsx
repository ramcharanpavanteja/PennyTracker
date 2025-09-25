import React, { useState } from 'react';
import { MdClose, MdAttachMoney, MdDescription, MdDateRange } from "react-icons/md";
import axios from 'axios';

const ExpenseForm = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
   const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !purpose || !date) return;

    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const payload = {
        amount: Number(amount), // <--- ensure numeric
        purpose,
        date,
      };
      const res = await axios.post("/api/expense/addExpense", payload, {
        headers,
      });

      if (onSave && res.data) {
        onSave(res.data); // <-- update parent state immediately
      }
      onClose(); // close only after saving
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="top-50 absolute inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          <MdClose size={20}  />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border p-2 rounded-md">
            <MdAttachMoney className="text-gray-500 mr-2" />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border p-2 rounded-md">
            <MdDescription className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border p-2 rounded-md">
            <MdDateRange className="text-gray-500 mr-2" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
