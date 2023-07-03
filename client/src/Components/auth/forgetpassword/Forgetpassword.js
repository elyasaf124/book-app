import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import './forgetpassword.css'
import { baseUrl } from "../../..";

function ForgetPassword(props) {
    const [email, setEmail] = useState('')

    let navigate = useNavigate();

    console.log(email)

    const forgetPass = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.create({ withCredentials: true }).post(`${baseUrl}/users/forgotPassword`, {
                email: email

            });
            if (!res) {
                return "not work"
            }

            navigate("/successSendPass", { replace: false });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div onSubmit={(e) => forgetPass(e)} className="forgetPass-container">
            <p className="text">please insert your Email:</p>
            <input onChange={(e) => setEmail(e.target.value)} className="input-forgetPass" placeholder="your Email..." />
            <button className="button-forgetPass" onClick={(forgetPass)}>send</button>
        </div>
    );
}

export default ForgetPassword;