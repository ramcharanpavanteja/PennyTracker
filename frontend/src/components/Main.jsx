import React from "react";
import { BiRupee } from "react-icons/bi";
import BudgetBar from "./BudgetBar";

function Main({
  user,
  recentIncome,
  monthlyBudget,
  expenses,
  income,
  setMonthlyBudget,
  error,
  setActivePage,
}) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const totalIncome = income
    .filter((i) => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  
  const totalExpense = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const savings = (totalIncome || 0) - totalExpense;

  const latestFiveExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const latestFiveIncome = [...income]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Budget Bar */}
      <div className="w-full ">
        <BudgetBar
          monthlyBudget={monthlyBudget}
          setMonthlyBudget={setMonthlyBudget}
          expenses={expenses}
        />
      </div>

      {/* Monthly data cards */}
      <div className="mt-8 w-full max-w-5xl flex flex-wrap justify-center gap-6 lg:gap-25 ">
        {/* Income */}
        <div className="flex flex-col items-start shadow-md bg-white rounded-md p-5 w-full sm:w-[45%] lg:w-[25%]">
          <div>
            <h2 className="card-heading text-lg font-semibold">Income</h2>
            
          </div>
          <h3 className="card-amount flex items-center font-bold text-xl text-indigo-500">
            <BiRupee className="relative top-[2px]" /> {totalIncome || 0}
          </h3>
        </div>

        {/* Expenses */}
        <div className="flex flex-col items-start shadow-md bg-white rounded-md p-5 w-full sm:w-[45%] lg:w-[25%]">
          <h2 className="card-heading text-lg font-semibold">Expenses</h2>
          <h3 className="card-amount flex items-center font-bold text-xl text-red-500">
            <BiRupee className="relative top-[2px]" /> {totalExpense || 0}
          </h3>
        </div>

        {/* Savings */}
        <div className="flex flex-col items-start shadow-md bg-white rounded-md p-5 w-full sm:w-[45%] lg:w-[25%]">
          <h2 className="card-heading text-lg font-semibold">Savings</h2>
          <h3 className="card-amount flex items-center font-bold text-xl text-green-600">
            <BiRupee className="relative top-[2px]" /> {savings || 0}
          </h3>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="w-full max-w-5xl mt-10 p-6 rounded-md flex flex-col lg:flex-row lg:space-x-6 space-y-10 lg:space-y-0">
        {/* Expense table */}
        <div className="w-full bg-white p-4 rounded-md shadow-md ">
          <div className="flex justify-between items-center p-2 rounded-md">
            <h2 className="text-xl font-bold mb-3">Recent Expenses</h2>
            <div className="">
              <button
                onClick={() => setActivePage("expense")}
                className="text-indigo-600 hover:underline"
              >
                View More →
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-none rounded-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2">Amount</th>
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  latestFiveExpenses.map((exp, i) => (
                    <tr
                      key={i}
                      className="border-t text-center border-gray-300 hover:bg-gray-50"
                    >
                      <td className="p-2 text-red-500 ">- ₹{exp.amount}</td>
                      <td className="p-2">{exp.purpose}</td>
                      <td className="p-2">
                        {new Date(exp.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-4 text-gray-500 text-center"
                    >
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Income Table */}
        <div className="w-full bg-white p-4 rounded-md shadow-md ">
          <div className="flex justify-between items-center p-2 rounded-md">
            <h2 className="text-xl font-bold mb-3">Recent Income</h2>
            <div className="">
              <button
                onClick={() => setActivePage("income")}
                className="text-indigo-600 hover:underline"
              >
                View More →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-none rounded-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2">Amount</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {income.length > 0 ? (
                  latestFiveIncome.map((income, i) => (
                    <tr
                      key={i}
                      className="border-t text-center border-gray-300 hover:bg-gray-50"
                    >
                      <td className="p-2 text-green-500 ">+ ₹{income.amount}</td>
                      <td className="p-2">{income.source}</td>
                      <td className="p-2">
                        {new Date(income.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-4 text-gray-500 text-center"
                    >
                      No income found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
