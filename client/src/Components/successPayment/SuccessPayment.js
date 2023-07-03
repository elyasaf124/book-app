import React, { useEffect } from 'react'
import './successPayment.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { baseUrl } from '../..'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../../features/loginMoodSlice'

const SuccessPayment = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const books = JSON.parse(localStorage.getItem('myArray'));

    useEffect(() => {
        const session = queryParams.get("session_id");
        let session_id = session?.split(" = ")[0];
        axios.get(`${baseUrl}/webhook/${session_id}`).then((res) => {
            if (res.data.session.status === "complete") {
                axios.create({ withCredentials: true })
                    .patch(`${baseUrl}/booking/updateQuantityBooks`, {
                        books
                    })
                    .then((res) => {
                        if (res.data.status === "success") {
                            localStorage.removeItem("myArray");
                            dispatch(setUserDetails(res.data.data.user))
                        }
                    })
            }
        })
    }, [books]);
    return (
        <div className="successPayment">
            <div className="successPayment-container">
                <h1>הזמנה בוצעה בהצלחה!</h1>
                <p>תודה על רכישתך מקווים שתהנה חשבונית תישלח למייל בדקות הקרובות</p>
                <button onClick={() => navigate("/")} className="btn-success">
                    המשך לאתר
                </button>
            </div>
        </div>
    )
}

export default SuccessPayment