import axios from 'axios';
import './loginModel.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterModel from '../registerModel/RegisterModel';
import { setLogin, setLoginModel, setRegisterModel, setUserDetails } from '../../features/loginMoodSlice';
import { baseUrl } from '../..';

function LoginModel() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorLogin, setErrorLogin] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const model = useSelector((state) => state)

    const login = async (e, emailUser, passwordUser) => {
        e.preventDefault()
        try {
            await axios.create({ withCredentials: true }).post(`${baseUrl}/users/login`, {
                email: emailUser ? emailUser : email,
                password: passwordUser ? passwordUser : password

            }).then(res => {
                dispatch(setUserDetails(res.data.data.user))
                localStorage.setItem('email', res.data.data.user.email)
                localStorage.setItem('userName', res.data.data.user.firstName)
                dispatch(setLogin())
                navigate("/", { replace: true });
                dispatch(setLoginModel())
            })
        } catch (error) {
            setErrorLogin(true)
            console.log(error)
        }
    };

    const resetPass = async () => {
        try {
            await axios.create({ withCredentials: true }).post(`${baseUrl}/users/forgotPassword`, {
                email: email
            }).then(() => {
                alert('reset password send to your email')
            })
        } catch (error) {
            alert("there is a problem please try agein later")
        }
    }

    return (
        <>
            {model.registerModel == true ? <RegisterModel login={login} /> : null}
            <div className='loginModel' onClick={() => dispatch(setLoginModel())} >
                <div className='loginModelContainer' onClick={(e) => e.stopPropagation()}>
                    <div className='closeModel' onClick={() => dispatch(setLoginModel())}>
                        <ion-icon class='closeIcon' name="close-circle-outline"></ion-icon>
                    </div>
                    <h2 className='formTitle'>התחברות</h2>
                    <form className='form'>
                        <div className='formLabelContainer'>
                            <div className='formLabel email'>
                                <label className='label labelEmail'>איימיל</label>
                                <input onChange={(e) => setEmail(e.target.value)} type='email' className='inputLogin email' />
                            </div>
                            <div className='formLabel password'>
                                <label className='label labelPassword '>סיסמא</label>
                                <input onChange={(e) => setPassword(e.target.value)} type='password' className='inputLogin password' />
                            </div>
                            {errorLogin ? <span className='bedLogin'>email or password are not correct *</span> : null}
                        </div>
                        <div className='containerFormBottum'>
                            <button onClick={login} className='loginBtn'>התחברות</button>
                            <p className='textForm'>עוד לא רשום? <a className='registerBtn' onClick={() => {
                                dispatch(setRegisterModel())

                            }}
                            >לחץ להרשמה</a></p>
                            <p className='textForm'><a onClick={resetPass} className='forgetPassBtn'>שחכתי סיסמא</a></p>
                        </div>
                    </form>
                </div>
            </div >
        </>
    )
}

export default LoginModel