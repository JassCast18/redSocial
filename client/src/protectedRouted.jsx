import {Navigate, Outlet} from "react-router-dom"
import { userAuth } from "./context/AuthContext"

function protectedRouted() {
    const {user, isAuthenticated} =userAuth()

    if(!isAuthenticated) return <Navigate to="/login" replace/>
  return <Outlet/>;
}

export default protectedRouted