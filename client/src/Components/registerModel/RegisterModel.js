import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registerModel.css'
import { setLoginModel, setRegisterModel } from '../../features/loginMoodSlice';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../..';

function RegisterModel(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [userDetails, setUserDetails] = useState({
        firstName: undefined,
        lastName: undefined,
        age: undefined,
        email: undefined,
        city: undefined,
        tel: undefined,
        password: undefined,
        passwordConfirm: undefined,
    })

    const handleChange = (e) => {
        setUserDetails((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const register = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${baseUrl}/users/signup`, {
                user: userDetails

            }, { withCredentials: true })
                .then(() => {
                    props.login(e, userDetails.email, userDetails.password)
                    dispatch(setRegisterModel())
                    navigate("/", { replace: true });
                })
        } catch (err) {
            console.log(err)
        }

    };

    const closeModel = () => {
        dispatch(setRegisterModel())
        dispatch(setLoginModel())
    }

    return (
        <div className='register' onClick={closeModel}>
            <div className='registerContainer' onClick={(e) => e.stopPropagation()} >
                <div onClick={closeModel} className='closeModel'>
                    <ion-icon class='closeIcon' name="close-circle-outline"></ion-icon>
                </div>
                <h2 className='formTitle'>הרשמה</h2>
                <form className='form'>
                    <div className='formLabelContainer'>
                        <div className='formLabel'>
                            <label className='label '>שם פרטי</label>
                            <input id='firstName' onChange={handleChange} type='email' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label '>שם משפחה</label>
                            <input id='lastName' onChange={handleChange} type='text' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label'>גיל</label>
                            <input id='age' onChange={handleChange} type='number' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label '>איימיל</label>
                            <input id='email' onChange={handleChange} type='email' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label '>טלפון</label>
                            <input id='tel' onChange={handleChange} type='email' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label '>עיר</label>
                            <input id='city' onChange={handleChange} type='text' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label'>סיסמה</label>
                            <input id='password' onChange={handleChange} type='password' className='inputLogin' />
                        </div>
                        <div className='formLabel'>
                            <label className='label'>אימות סיסמא</label>
                            <input id='passwordConfirm' onChange={handleChange} type='password' className='inputLogin' />
                        </div>
                    </div>
                    <div className='containerFormBottum'>
                        <button onClick={(e) => register(e)} className='registerBtnR'>הרשמה</button>
                        <p className='textForm'>כבר רשום? <a onClick={() => dispatch(setRegisterModel())} className='loginBtnR'>לחץ התחברות</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default RegisterModel