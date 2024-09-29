import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from "./ForgotPassword.module.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");  // Define otp state
    const [stage, setStage] = useState(1);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    console.log(stage)
    const sendMail = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/user/forgot-password", { email });
            setStage(2);
          console.log(response);
            alert("Password reset email sent");
            console.log("Email sent")
        } catch(error) {
            if(error.response.data.message) {
                alert(error.response.data.message);
                return;
            } else {
                alert('Internal Server Error');
            }
            console.error(error);
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/user/verify-otp', { email, otp });
            alert(response.data.message);
            setStage(3);
        } catch(error) {
           if(error.response.data.message) {
                alert(error.response.data.message);
                return;
           } else {
                alert('Internal Server Error');
           }
        }
    }

    const changePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/user/change-password" , 
                { email, password });
            alert(response.data.message);
            navigate("/admin/login");
        } catch(error) {
            if(error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Internal Server Error");
            }
        }
    }
  return (
    <> 
    <div className={style.forgotPasswordContainer}>
        { stage==1 ?
            <form onSubmit={sendMail} className={style.forgotPasswordForm}>
            <label htmlFor="email">Email: </label>
                <input type="email" id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="submit" value="Submit" />
            </form> : 
            stage == 2 ? 
            <form onSubmit={verifyOtp} className={style.forgotPasswordForm}>
            <h1>Verify OTP</h1>
            <label htmlFor="otp">OTP: </label>
                <input type="text" id='otp' name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <input type="submit" value="Submit" />
            </form> : 
            <form onSubmit={changePassword} className={style.forgotPasswordForm}>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                <input type="submit" value="Submit" />
            </form>
        }
    </div>
    </>
  )
}

export default ForgotPassword