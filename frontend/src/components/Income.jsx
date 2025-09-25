import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import IncomeForm from "./IncomeForm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Income({ income = [], token, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentPage, setCurrentPage] = useState(1);

  const sortedIncome = [...income].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddIncome = (newIncome) => {
  // push the new income into the array
    if (Array.isArray(income)) {
      income.push(newIncome);
    }
    setShowForm(false);
  };

  // ---- Delete ----
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/income/${id}`, {
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
    items.forEach((inc) => {
      const month = new Date(inc.date).getMonth();
      totals[month] += inc.amount || 0;
    });
    return totals.map((amt, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      amount: amt,
    }));
  };

  const monthlyData = getMonthlyTotals(sortedIncome);

  // ---- Filter by Selected Month ----
  const filteredIncome = sortedIncome.filter(
    (inc) => new Date(inc.date).getMonth() === selectedMonth
  );

  // ---- Pagination ----
  const rowsPerPage = 5;
  const totalPages = Math.ceil(filteredIncome.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedIncome = filteredIncome.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="relative">
    
      <div
        className={`w-full p-2 rounded-md transition-all duration-300 ${
          showForm
            ? "opacity-40 pointer-events-none"
            : "bg-white shadow-md"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-2">
          <h2 className="text-xl font-bold">Recent Income</h2>

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

            {/* Add Income Button */}
            <button
              className="bg-indigo-500 text-white p-2 rounded-md"
              onClick={() => setShowForm(true)}
            >
              Add Income
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-none rounded-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2">Amount</th>
              <th className="p-2">Source</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIncome.length > 0 ? (
              paginatedIncome.map((inc) => (
                <tr
                  key={inc._id}
                  className="border-t text-center border-gray-300"
                >
                  <td className="p-2 text-red-500">- ₹{inc.amount}</td>
                  <td className="p-2">{inc.source}</td>
                  <td className="p-2">
                    {new Date(inc.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(inc._id)}
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
                  No income found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredIncome.length > rowsPerPage && (
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
        <h2 className="text-lg font-semibold mb-2">Yearly Income Overview</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} className="p-5">
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Form Modal */}
      {showForm && (
        <IncomeForm onClose={() => setShowForm(false)} onSave={handleAddIncome} />
      )}
    </div>
  );
}

export default Income;
