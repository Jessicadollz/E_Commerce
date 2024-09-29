import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./admin/Login/Login";
import Dashboard from "./admin/Dashboard/Dashboard";
import Register from "./components/Register";
import SingleProduct from "./admin/SingleProduct";
import ForgotPassword from "./admin/ForgotPassword/ForgotPassword";
import Cloudinary from "./admin/Cloudinary/Cloudinary";
import { useEffect, useState } from "react";
import instance from "./admin/axiosConfig";
import ProtectedRouter from "./components/ProtectedRouter";
import PublicRouter from "./components/PublicRouter";
import AddProduct from "./admin/AddProduct/AddProduct";

function App() {
  const[isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  async function fetchUserStatus() {
    try {
      const response = await instance.get("/user/loggedIn");
      if(response.statusText === "OK")  setIsUserLoggedIn(true);
      else  setIsUserLoggedIn(false);
    } catch(err) {
      console.log("Error checking login status: " + err);
      setIsUserLoggedIn(false);
    }
  }

  useEffect(() => {fetchUserStatus();}, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
           //<PublicRouter isUserLoggedIn={isUserLoggedIn}>
              <Register />
          // </PublicRouter> 
          }></Route>
            
          <Route path="/admin/login" element={
           //<PublicRouter isUserLoggedIn={isUserLoggedIn}>
              <Login />
           //</PublicRouter> 
            }></Route>

          <Route path="/admin/dashboard" element={
           // <ProtectedRouter isUserLoggedIn={isUserLoggedIn}>
              <Dashboard />
            //</ProtectedRouter>
          }></Route>

          <Route path="/admin/product" element={
            //<ProtectedRouter isUserLoggedIn={isUserLoggedIn}>
              <SingleProduct />
            //</ProtectedRouter>
          }></Route>

          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/admin/add" element={<AddProduct />}></Route>
          {/* <Route path="/upload" element={<Cloudinary />}></Route> */}
        </Routes>
      </BrowserRouter>
      {/* <Cloudinary /> */}
    </>
  );
}

export default App;