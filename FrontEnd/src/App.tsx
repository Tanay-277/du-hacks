import { Appbar, Filters, Store } from "./components/blocks";
import Stripe from "./components/blocks/Stripe";
import { BrowserRouter, Route, Routes } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./utils/AuthContext";
import HomeLayout from "./layouts/HomeLayout";
import CreateProduct from "./pages/CreateProduct";

function Home() {
  return (
    <main>
      <div className="w-full flex flex-row">
        {/* <Filters /> */}
        <Store />
        {/* <Stripe/> */}
      </div>
    </main>
  )
}

export function Routing() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<HomeLayout />} >
        <Route path="/" element={<Home />} />
        <Route path="/newProduct" element={<CreateProduct />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </BrowserRouter>
  )
}

