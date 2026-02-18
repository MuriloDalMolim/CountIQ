import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Auth } from '../pages/auth/index';
import { Home } from '../pages/home';
import { Users } from "../pages/Users";
import { Products } from "../pages/Products";
import { Lists } from "../pages/Lists";
import { Counts } from "../pages/Counts";
import { Company } from "../pages/Company";

function PrivateRoutes() {
    const { isAuthenticated } = useAuth(); 
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />} />

                <Route element={<PrivateRoutes />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/lists" element={<Lists />} />
                    <Route path="/counts" element={<Counts />} />
                    <Route path="/company" element={<Company />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}