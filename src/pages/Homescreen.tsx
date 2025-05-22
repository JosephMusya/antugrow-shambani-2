import { Route, Routes } from "react-router-dom"
import FarmerDashboard from './Dashboard'

export default function Homescreen() {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<FarmerDashboard/>} ></Route>
      </Routes>
    </div>  )
}
