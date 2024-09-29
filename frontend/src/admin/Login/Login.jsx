import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import Dashboard from "../Dashboard/Dashboard";
import { Link, useNavigate } from "react-router-dom";
import style from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  async function isUserLoggedIn() {
    try {
      const response = await axios.get("/user/loggedIn");
      if (response.statusText === "OK") setIsLoggedIn(true);
      else setIsLoggedIn(false);
    } catch (err) {
      console.log("Error checking login status: " + err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/user/login", {
        email,
        password,
        role: "admin",
      });
      console.log(response);
      alert("Logged in successfully!");
      navigate("/admin/dashboard");
      //   console.log(document.cookie);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {isLoggedIn ? (
        <Dashboard setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <>
          <div className={style.loginContainer}>
          <h2 className={style.loginTitle}>Admin Login</h2>
          <form action="" onSubmit={handleSubmit} className={style.loginForm}>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <br />
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit" className={style.loginButton}>Login</button>
          </form>
          <Link to={'/forgot-password'}>Forgot Password</Link>
          </div>
        </>
      )}
    </>
  );
}

export default Login;