import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import ExpenseForm from "./ExpenseForm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Expenses({ expenses = [], token, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentPage, setCurrentPage] = useState(1);

  const sortedExpense = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddExpense = (newExpense) => {
  // push the new expense into the array
    if (Array.isArray(expenses)) {
      expenses.push(newExpense);
    }
    setShowForm(false);
  };

  // ---- Delete ----
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/expense/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      if (onDelete) onDelete(id); // update parent state
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // ---- Monthly Totals for Graph ----
  const getMonthlyTotals = (items) => {
    const totals = Array(12).fill(0); // Jan–Dec
    items.forEach((exp) => {
      const month = new Date(exp.date).getMonth();
      totals[month] += exp.amount || 0;
    });
    return totals.map((amt, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      amount: amt,
    }));
  };

  const monthlyData = getMonthlyTotals(sortedExpense);

  // ---- Filter by Selected Month ----
  const filteredExpenses = sortedExpense.filter(
    (exp) => new Date(exp.date).getMonth() === selectedMonth
  );

  // ---- Pagination ----
  const rowsPerPage = 5;
  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="relative">
      {/* Expense List */}
      <div
        className={`w-full  p-2 rounded-md transition-all duration-300 ${
          showForm
            ? "opacity-40 pointer-events-none"
            : "bg-white shadow-md"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-2">
          <h2 className="text-xl font-bold">Recent Expenses</h2>

          <div className="flex space-x-3 items-center">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded-md"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            {/* Add Expense Button */}
            <button
              className="bg-indigo-500 text-white p-2 rounded-md"
              onClick={() => setShowForm(true)}
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-none rounded-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2">Amount</th>
              <th className="p-2">Purpose</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((exp) => (
                <tr
                  key={exp._id}
                  className="border-t text-center border-gray-300"
                >
                  <td className="p-2 text-red-500">- ₹{exp.amount}</td>
                  <td className="p-2">{exp.purpose}</td>
                  <td className="p-2">
                    {new Date(exp.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500 text-center">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredExpenses.length > rowsPerPage && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Yearly Bar Chart */}
      <div className="w-full h-70 my-4 bg-white shadow-md p-5 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Yearly Expense Overview</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} className="p-5">
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm onClose={() => setShowForm(false)} onSave={handleAddExpense} />
      )}
    </div>
  );
}

export default Expenses;
