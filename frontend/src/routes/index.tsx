import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Auth } from '../pages/auth/index';
import { Home } from '../pages/home';

function PrivateRoutes() {
  const { isAuthenticated } = useAuth(); 
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route element={<PrivateRoutes />}>
                    <Route path="/home" element={<Home />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}