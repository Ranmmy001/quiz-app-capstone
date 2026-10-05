import Home from "./pages/home/Home"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/login/Login"
import AdminDashboard from "./pages/adminDashboard/AdminDashboard"
import Error404 from "./components/error404/Error404"
import GameMode from "./pages/gameMode/GameMode"

function App() {
  

  return (
    <>
    <Routes>
      <Route path="*" element={<Error404 />} />
      <Route path="/" element={<Home />} />
      <Route path="/game-mode" element={<GameMode />} />
      <Route path="/admin/login" element={<Login />} />
      {/* <Route path="/dashboard/:token" element={<AdminDashboard />} /> */}
      <Route path="/app/private-route/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
    </>
  )
}

export default App
