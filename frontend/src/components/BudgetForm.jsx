import React, { useState } from "react";
import axios from "axios";

function BudgetForm({ initialValue = "", setMonthlyBudget, onClose }) {
  const [budget, setBudget] = useState(initialValue || "");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setBudget(e.target.value);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/api/users/budget",
        { monthlyBudget: Number(budget) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newBudget =
        res.data?.user?.monthlyBudget ??
        res.data?.monthlyBudget ??
        Number(budget);

      if (setMonthlyBudget) setMonthlyBudget(newBudget);
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
        <h1 className="text-center text-xl font-bold mb-4">
          {initialValue ? "Update Budget" : "Set Monthly Budget"}
        </h1>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3">
          <input
            onChange={handleChange}
            type="number"
            value={budget}
            placeholder="Enter monthly budget"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
          >
            Save
          </button>
        </form>

        <button
          onClick={onClose}
          className="block mt-4 text-gray-600 hover:text-gray-800 text-sm mx-auto "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default BudgetForm;
