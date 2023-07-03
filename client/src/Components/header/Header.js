import './header.css'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoginModel from "../loginModel/LoginModel";
import { setLogout, setLoginModel } from "../../features/loginMoodSlice";
import { baseUrl } from '../..';

function Header() {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const statusLog = useSelector((state) => state.isLoggedIn)
    const model = useSelector((state) => state)
    const cartQuantity = useSelector((state) => state.user.myCart)

    const [searchInput, setSearchInput] = useState()
    const [quantity, setQuantity] = useState()

    const userName = localStorage.getItem('userName')

    useEffect(() => {
        let totalQuantity = 0;
        cartQuantity.forEach((item) => {
            totalQuantity += item.quantity;
        });
        setQuantity(totalQuantity);
    }, [cartQuantity]);


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

    const tuggleLoginModel = () => {
        dispatch(setLoginModel())
    }

    const search = () => {
        navigate(`/searchResult?search=${searchInput}`)
    }


    return (
        <>
            {model.loginModel === true ? <LoginModel /> : null}
            <div className="header">
                <div className="headerContainer">
                    <div className="contect">
                        <ul className="navBar-right">
                            {statusLog === true ? <div className="connectContainer">
                                <div onClick={() => navigate('/myAccount')} className="loginText connect">שלום, {userName}</div>
                                <div onClick={logout}>התנתק</div>
                            </div>
                                :
                                <>
                                    <li onClick={() => tuggleLoginModel()} className="li"><ion-icon class='editIcon' name="create-outline"></ion-icon></li>
                                    <li className="loginText" onClick={tuggleLoginModel}>הרשמה / כניסה</li>
                                </>
                            }
                            <div className="socialNetworksIcons">
                                <ion-icon name="logo-instagram"></ion-icon>
                                <ion-icon name="logo-facebook"></ion-icon>
                                <ion-icon name="logo-tiktok"></ion-icon>
                            </div>
                        </ul>
                        <ul className="navBar-left">
                            <li>סניפים</li>
                            <li>כרטיס מתנה</li>
                            <li>ביטול הזמנה</li>
                            <button className="buttonNav">עצירת תנועה</button>
                            <button className="buttonNav">ניגודיות</button>
                        </ul>
                    </div>
                    <div className="logoCategory">
                        <div className="category">
                            <div className="manuIconContainer"><ion-icon class='manuIcon' name="menu-outline"></ion-icon></div>
                            <div className="categoryText">כל הקטגוריות</div>
                        </div>
                        <Link to={'/'} className="logo" >
                            <img className="subLogo" src="https://www.booknet.co.il/images/logo.png" />
                        </Link>
                        <div className="empty"></div>
                    </div>
                    <div className="nav">
                        <div className="navContainer">
                            <ul className="navLiat">
                                <li>העשירייה הפותחת</li>
                                <li>בלוג</li>
                                <li>משחקים</li>
                                <li>עיון</li>
                                <li>ילדים ונוער</li>
                                <li>ENGLISH BOOKS</li>
                                <li>סיפורת</li>
                                <li>בוקסרים גרבים ועוד</li>
                                <li>LGBTQ</li>
                            </ul>
                            <div className="search">
                                <div className="cartIconContainer" onClick={() => navigate('/cart')}>
                                    <ion-icon class='cartIcon' name="cart-outline"></ion-icon>
                                    <div className="notfication">
                                        <div className="numNotfiactio">
                                            {statusLog === true ? quantity : 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="searchInputContainer">
                                    <input onChange={(e) => { setSearchInput(e.target.value) }} placeholder="חיפוש..." className="inputSearch" />
                                    <ion-icon onClick={search} class='searchIcon' name="search-outline"></ion-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="msg-container">
                    <div className="msg-header">משלוח חינם בקניה מעל 249</div>
                </div>
            </div>
        </>
    )

}
export default Header;
