import React, { useState } from "react";
import BudgetForm from "./BudgetForm";

function BudgetBar({ monthlyBudget, setMonthlyBudget, expenses = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalExpense = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const expensePercent = monthlyBudget
    ? Math.min((totalExpense / monthlyBudget) * 100, 100)
    : 0;

  let percentColor = "bg-green-500";
  if (expensePercent > 75) 
  {
    percentColor = "bg-red-500";
    if (!alertVisible) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 30000); // reset after 30s
    }
  }

  else if (expensePercent > 50){
     percentColor = "bg-yellow-500";
     if (!alertVisible) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 30000); // reset after 30s
    }

  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Heading & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-3">
        <h2 className="text-xl font-bold">Monthly Budget</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-500 px-4 py-2 rounded-md text-white hover:bg-indigo-400 transition"
        >
          {monthlyBudget ? "Update Budget" : "Set Budget"}
        </button>
      </div>

      {/* Progress bar */}
      {monthlyBudget ? (
        <>
          <div className={`relative w-full h-4 bg-gray-200 rounded-md overflow-hidden ${alertVisible ? 'blink' : ''}`}>
            <div
              className="h-full bg-blue-500"
              style={{ width: `${expensePercent}%` }}
            />
            <div
              className={`absolute top-0 h-full ${percentColor}`}
              style={{
                left: `${expensePercent}%`,
                width: `${100 - expensePercent}%`,
              }}
            />
          </div> 
          
          <div className="flex justify-between mt-2 text-sm font-semibold">
            <span className="text-blue-500 ">₹{totalExpense}</span>
            <span className="text-gray-700">₹{monthlyBudget}</span>
          </div>
           {alertVisible && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-center border border-red-300">
              {expensePercent > 75  ? "Warning: You have exceeded 75% of your budget!"
              : "Caution: You have exceeded 50% of your budget!"}
            </div>
          )
          }
        </>
      ) : (
        <p className="text-gray-500 mt-2">No budget set for this month</p>
      )}

      {showForm && (
        <BudgetForm
          initialValue={monthlyBudget}
          setMonthlyBudget={setMonthlyBudget}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default BudgetBar;
