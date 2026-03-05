import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Auth } from '../pages/auth/Auth.tsx';
import { Home } from '../pages/home/Home.tsx';
import { Users } from '../pages/Users/Users';
import { Products } from "../pages/Products/Products.tsx";
import { Lists } from "../pages/Lists/Lists.tsx";
import { Counts } from "../pages/Counts/Counts.tsx";
import { Company } from "../pages/Company";
import { Layout } from '../components/Layout';
import { Counting } from '../pages/Counts/Counting.tsx';
import { CountView } from '../pages/Counts/CountView.tsx';



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
                    <Route path="/counts/view/:listId" element={<CountView />} />
                    <Route path="/counting/:listId" element={<Counting />} />
                    <Route path="/company" element={<Company />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}