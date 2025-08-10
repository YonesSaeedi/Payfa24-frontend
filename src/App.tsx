import './App.css'
import AppRouter from './routes'
import "./assets/Color/Color-Theme.css"


import React, { useContext } from "react";
import { ThemeContext } from "./Context/ThemeContext"; 

function App() {
const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");

  const { theme, toggleTheme } = context;
  return (
    <div className='bg-third'>
      <AppRouter />
     <button
  className="bg-secondary px-4 py-2 rounded text-white"
  onClick={() => {
    document.documentElement.classList.toggle("dark");
  }}
>
  Toggle Dark Mode
</button>
 <div className="min-h-screen bg-rose-300 text-text flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold bg-secondary ">
        حالت فعلی: <span className="capitalize">{theme}</span>
      </h1>

      <button
        onClick={toggleTheme}
        className="bg-primary text-white px-6 py-2 rounded shadow-md transition"
      >
        تغییر تم
      </button>
    </div>
    </div>
  )
}

export default App
