import axios from "axios";
import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import './resetPassword.css'
import { baseUrl } from "../../..";

function ResetPassword() {
    const [pass, setPass] = useState()
    const [confirmPass, setConfirmPass] = useState()
    const { token } = useParams();
    let navigate = useNavigate();

    const resetPass = async (e) => {
        e.preventDefault()
        try {
            await axios
                .create({ withCredentials: true })
                .patch(`${baseUrl}/users/resetPassword/${token}`, {
                    password: pass,
                    passwordConfirm: confirmPass
                }).then(() => {
                    localStorage.clear()
                    navigate("/", { replace: true });
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={(e) => resetPass(e)} className="resetPass-container">
            <p className="text">please insert new Password:</p>
            <input onChange={(e) => setPass(e.target.value)} className="input-resetPass" placeholder="your new password..." />
            <input onChange={(e) => setConfirmPass(e.target.value)} className="input-resetPass" placeholder="confirm new password..." />
            <button className="button-resetPass" onClick={(resetPass)}>send</button>
        </form>
    );
}

export default ResetPassword;