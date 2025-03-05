import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Welcome from './components/Welcome'
import ReactDOM from 'react-dom/client'
import Navbar from './components/Navbar'
import Tracker from './pages/Tracker'
import SlippagePerDollar from './components/graphs/SlippagePerDollar'

export default function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="table" element={<Tracker />} />
        <Route path="graphs" element={<SlippagePerDollar />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
