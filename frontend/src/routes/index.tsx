import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Auth } from '../pages/auth/Auth.tsx';
import { Home } from '../pages/home/Home.tsx';
import { Users } from '../pages/Users/Users';
import { Products } from "../pages/Products";
import { Lists } from "../pages/Lists";
import { Counts } from "../pages/Counts";
import { Company } from "../pages/Company";
import { Layout } from '../components/Layout';



export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />} />

                <Route element={<Layout/>}>
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