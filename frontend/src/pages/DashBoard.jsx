import { useEffect, useState } from "react";
import axios from "axios";
import SideNavigation from "../components/SideNavigation";
import Main from "../components/Main";
import Expenses from "../components/Expenses";
import Income from "../components/Income";


// --- Simple Speech Recognition Hook ---
function useSpeechRecognition(onResult) {
  const [listening, setListening] = useState(false);
  let recognition = null;

  const start = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setListening(true);
    };

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      console.log("Voice recognized:", text); // <-- logs the captured text
      onResult(text);
      setListening(false);
    };

    recognition.onerror = (err) => {
      console.error("Voice recognition error:", err); // <-- logs errors
      setListening(false);
    };

    recognition.onend = () => {
      console.log("Voice recognition ended");
      setListening(false);
    };

    recognition.start();
  };

  return { start, listening };
}


const DashBoard = ({ user, setUser }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(null);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const token = localStorage.getItem("token");

  // --- CRUD Handlers ---
  const handleDeleteExpense = (id) =>
    setExpenses((prev) => prev.filter((e) => e._id !== id));

  const handleDeleteIncome = (id) =>
    setIncome((prev) => prev.filter((e) => e._id !== id));

  const handleAddExpense = (exp) =>
    setExpenses((prev) => [exp, ...prev]);

  const handleAddIncome = (inc) =>
    setIncome((prev) => [inc, ...prev]);

  // --- Voice command handling ---
  const handleVoiceCommand = async (text) => {
  console.log("Sending voice text to backend:", text); // <-- see what is sent
  setStatusMessage(`Processing: "${text}"`);

  try {
    const res = await axios.post(
      "/api/voice/addVoiceCommand",
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { type, savedDoc, message } = res.data;

    if (type === "expense") setExpenses((prev) => [savedDoc, ...prev]);
    if (type === "income") setIncome((prev) => [savedDoc, ...prev]);
    if (type === "budget") setMonthlyBudget(savedDoc.monthlyBudget || savedDoc.amount);

    setStatusMessage(message || "Saved!");
  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);
    setStatusMessage(err.response?.data?.message || "Error saving");
  }
};

  const { start: startListening, listening } = useSpeechRecognition(handleVoiceCommand);

  // --- Fetch data on load ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [budgetRes, expRes, incRes] = await Promise.all([
          axios.get("/api/users/budget", { headers }),
          axios.get("/api/expense/getExpense", { headers }),
          axios.get("/api/income/getIncome", { headers }),
        ]);

        setMonthlyBudget(budgetRes.data.monthlyBudget);
        setExpenses(expRes.data.expenses || []);
        setIncome(incRes.data.income || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="bg-gray-50 w-full flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 min-h-screen shadow-md fixed left-0 top-16">
        <SideNavigation
          setActivePage={setActivePage}
          activePage={activePage}
        />
      </div>

      {/* Main */}
      <div className="ml-[25%] w-3/4 p-6">
        {activePage === "dashboard" && (
          <Main
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            expenses={expenses}
            income={income}
            error={error}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "expense" && (
          <Expenses
            expenses={expenses}
            token={token}
            onDelete={handleDeleteExpense}
            onAdd={handleAddExpense}
          />
        )}

        {activePage === "income" && (
          <Income
            income={income}
            token={token}
            onDelete={handleDeleteIncome}
            onAdd={handleAddIncome}
          />
        )}
      </div>

      {/* Floating mic + status */}
      <button
        onClick={startListening}
        className={`fixed bottom-6 left-6 p-4 rounded-full shadow-lg text-white transition ${
          listening ? "bg-indigo-500 animate-pulse" : "bg-gray-100 hover:bg-indigo-300"
        }`}
      >
        {
        listening ?( <div className="px-3 py-2 rounded text-sm text-indigo-700 font-extrabold gap-1 flex">
          <span className="dot bg-white w-1 h-2 rounded-2xl"></span>
          <span className="dot bg-white w-1 h-2 rounded-2xl"></span>
          <span className="dot bg-white w-1 h-2 rounded-2xl"></span>
          <span className="dot bg-white w-1 h-2 rounded-2xl"></span>
          </div>):(<div>🎤</div>)
      }
        
      </button>

      {statusMessage && (
        <div className="fixed bottom-20 left-6 bg-white shadow px-3 py-2 rounded text-sm text-gray-700">
          {statusMessage}
        </div>
      )}
      
    </div>
  );
};

export default DashBoard;
