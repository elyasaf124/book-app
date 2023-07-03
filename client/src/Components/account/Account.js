import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import FotterContact from '../fotterContact/FotterContact'
import Fotter from '../footer/Footer'
import './account.css'
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../features/loginMoodSlice";
import { baseUrl } from "../..";


function Account() {
    const dispatch = useDispatch()
    const [user, setUser] = useState([])
    const [updateUserDetails, setUpdateUserDetails] = useState({
        firstName: undefined,
        lastName: undefined,
        tel: undefined,
        email: undefined
    })

    let userDetails = useSelector((state) => state.user)

    const [currentPass, setCurrentPass] = useState()
    const [newPass, setNewPass] = useState()
    const [confirmPass, setConfirmPass] = useState()

    let navigate = useNavigate();

    useEffect(() => {
        let userArr = []
        try {
            axios.create({ withCredentials: true }).get(`${baseUrl}/users/getMe`)
                .then(res => {
                    userArr.push(res.data.data.user)
                    setUser(userArr)
                })

        } catch (error) {
        }
    }, [])

    const handleChange = (e) => {
        setUpdateUserDetails((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const logout = async () => {
        await axios.get(`${baseUrl}/users/logout`, { withCredentials: true })
            .then(res => {
                if (res.data.status == "success") {
                    dispatch(setLogout())
                    localStorage.clear();
                    navigate('/', { replace: true })
                }
            })
    }

    const updateUser = async (e) => {
        e.preventDefault()
        try {
            axios.create({ withCredentials: true }).patch(`${baseUrl}/users/updateMe`, {
                updateUser: updateUserDetails
            }).then(() => {
                alert('Please log in again')
                logout()

            })
        } catch (error) {

        }
    }




    const updatePassword = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.create({ withCredentials: true }).patch(`${baseUrl}/users/updatePassword`, {
                currentPassword: currentPass,
                newPassword: newPass,
                passwordConfirm: confirmPass
            });
            navigate("/", { replace: true });
            alert('your password change successfully')
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const resetPass = async () => {
        try {
            await axios.create({ withCredentials: true }).post(`${baseUrl}/users/forgotPassword`, {
                email: user[0].email
            }).then(res => {
                if (res.data.status = 'success') {
                    alert('raset password send to your email')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }


    if (user[0] === undefined) {
        return <></>
    }
    return (
        <div>
            <div className="titleContainer">
                <h1 className="accountTitle">אזור אישי</h1>
            </div>
            <div className="account">
                <div className="accountContainer">
                    <form className="formAccount">
                        <div className="labelContainer">
                            <label className="labelFormAccount">שם פרטי</label>
                            <input id="firstName" type='text' onChange={handleChange} className="inputFormAccount" defaultValue={user[0].firstName} />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">שם משפחה</label>
                            <input id="lastName" type='text' onChange={handleChange} className="inputFormAccount" defaultValue={user[0].lastName} />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">דואר אלקטרוני</label>
                            <input id="email" type='email' onChange={handleChange} className="inputFormAccount" defaultValue={user[0].email} />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">רחוב</label>
                            <input className="inputFormAccount" />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">מספר בית </label>
                            <input defaultValue={user[0].email} className="inputFormAccount" />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">עיר</label>
                            <input defaultValue={user[0].city} className="inputFormAccount" />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">מיקוד</label>
                            <input defaultValue={user[0].email} className="inputFormAccount" />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount">מדינה</label>
                            <input defaultValue={user[0].country} className="inputFormAccount" />
                        </div>
                        <div className="labelContainer">
                            <label className="labelFormAccount"> טלפון נייד</label>
                            <input id="tel" onChange={handleChange} type='tel' className="inputFormAccount" defaultValue={user[0].tel} />
                        </div>
                        <button onClick={(e) => updateUser(e)} className="formAccountBtn">שמירה</button>
                        <div className="updatePassword">
                            <div className="updatePasswordContainer">
                                <div className="labelUpdatePass">
                                    <label>סיסמא נוכחית</label>
                                    <input className="updatePasswordInput" onChange={(e) => setCurrentPass(e.target.value)} type="password" />
                                </div>
                                <div className="labelUpdatePass">
                                    <label>סיסמא חדשה</label>
                                    <input className="updatePasswordInput" onChange={(e) => setNewPass(e.target.value)} type="password" />
                                </div>
                                <div className="labelUpdatePass">
                                    <label>אימות סיסמא</label>
                                    <input className="updatePasswordInput" onChange={(e) => setConfirmPass(e.target.value)} type="password" />
                                </div>
                                <button onClick={updatePassword} style={{ width: '100%' }} className="formAccountBtn">עדכן סיסמא</button>
                            </div>
                        </div>
                    </form>
                    <div className="orderandResetPassword">
                        <div className="historyOrder">
                            <div className="historyOrderContainer">
                                <p className="titleText">הסטוריית הזמנות</p>
                                <span className="text">לא נמצאו הזמנות</span>
                            </div>
                        </div>
                        <div className="resetPaasword">
                            <div className="resetPaaswordContainer">
                                <p className="titleText"> איפוס סיסמה</p>
                                <span className="text">קישור לאיפוס סיסמא יישלח לכתובת האיימיל המקושרת לחשבון <a onClick={resetPass} className="aTag">לאיפוס לחץ כאן  </a></span>
                            </div>
                        </div>
                        <div className="resetPaasword">
                            <div className="resetPaaswordContainer">
                                <p style={{ marginTop: "50px" }} className="titleText"> הוספת ספר</p>
                                <span className="text">על מנת לשלוח ספר לאישור לחץ על הלינק הבא: <a onClick={() => navigate('/addBook')} className="aTag"> לחץ כאן  </a></span>
                            </div>
                        </div>
                    </div>
                    {user[0].role === "admin" && <div className="resetPaaswordContainer">
                        <p className="titleText">  ספרים בהמתנה</p>
                        <span className="text">  קישור לצפיה בספרים שנמצאים בהמתנה לאישור <a onClick={() => navigate('/booksConfirm')} className="aTag">לצפייה לחץ כאן   </a></span>
                    </div>}
                </div>
            </div>
            <FotterContact />
            <Fotter />
        </div>
    );
}

export default Account;