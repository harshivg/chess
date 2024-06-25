import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './screens/Landing'
import Game from './screens/Game'

function App() {

  return (
    <>
      <div className="bg-slate-400 h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="game" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
