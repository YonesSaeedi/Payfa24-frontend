import './App.css'
import AppRouter from './routes'
import "./assets/Color/Color-Theme.css"

function App() {

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
    </div>
  )
}

export default App
