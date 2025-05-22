import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import { ProtectedRoutes } from "./utils/protected-routes/ProtectedRoutes"
import Dashboard from "./pages/Dashboard"
import ProfilePage from "./pages/ProfilePage"
import AddFarm from "./pages/AddFarm"
import FarmView from "./pages/FarmView"

function App() {
  return (
    <div>
      <Routes>
          <Route path="/login" element={<Login/>} >
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-profile" element={<ProfilePage/>} />
            <Route path="/add-farm" element={<AddFarm/>} />
            <Route path="/farm/:id" element={<FarmView/>} />
          </Route>
      </Routes>
    </div>
  )
}

export default App
