import axios from "axios";
import React, { useEffect, useState } from "react";
import './displayBook.css'
import { useParams } from 'react-router-dom'
import { baseUrl } from "../..";
import Loading from "../loading/Loading";

function DisplayBook(props) {
    const [inCart, setInCart] = useState(false)
    const [loading, setLoading] = useState(true)
    const [book, setBook] = useState([])

    const { bookId } = useParams();

    useEffect(() => {
        axios.create({ withCredentials: true }).get(`${baseUrl}/books/${bookId}`)
            .then(res => {
                setBook(res.data.data.book[0])
                setLoading(false)
            })
    }, [])

    const addToCart = async (e) => {
        e.stopPropagation()
        try {

            axios.create({ withCredentials: true }).post(`${baseUrl}/booking/addToCart`, {
                bookId: bookId,
                quantityBook: 1
            }).then(() => {
                setInCart(true)
                setTimeout(() => {
                    setInCart(false)
                }, 2000);

            }).catch(err => {
                alert('this book is already in your cart')
            })
        } catch (error) {
        }
    }

    if (book === undefined) {
        return <></>
    }
    return (
        <div>
            <div className="displayBook">
                <div className="displayBookContainer">
                    <div className="pathContainer">
                        <div className="path"><a href="/" className="pathAtag">דף הבית</a> &gt; {book.title}</div>
                    </div>
                    {loading === true ? <Loading /> : <div className="bookContainer">
                        <div className="imgContainer">
                            <img className="imgBook" src={book.image} />
                        </div>
                        <div className="descContainer">
                            <div className="row">
                                <h2 className="bookTitle">{book.title}</h2>
                                <div>
                                    <ion-icon name="star-outline"></ion-icon>
                                    <ion-icon name="star-outline"></ion-icon>
                                    <ion-icon name="star-outline"></ion-icon>
                                    <ion-icon name="star-outline"></ion-icon>
                                    <ion-icon name="star-outline"></ion-icon>
                                </div>
                            </div>
                            <span className="auther">{book.author}</span>
                            <div className="nav-cstm">
                                <div>קטגוריה: <a className="aTag" >סיפרות מקור, </a><a className="aTag">ספרות מתח ואימה</a></div>
                                <div>הוצאה: <a className="aTag">דני ספרים - הוצאה</a></div>
                            </div>
                            <h2>תקציר</h2>
                            <p className="desc">{book.description}</p>
                        </div>
                        <div className="buy">
                            <div className="buyContainer">
                                <div className="sale-stampaContainer">
                                    <a className="sale-stampa">מכירה מוקדמת - {book.priceSale} ש"ח</a>
                                </div>
                                <h3 className="priceWeb">מחיר באתר: ${book.price}</h3>
                                <span><del>מחיר קטלוגי: {book.priceSale}</del>$</span>
                                <div onClick={(e) => addToCart(e)} className="addToCartBtnBookContainer">
                                    {inCart ? <button className="addToCartBtnBook addToCartBtnSuccessfully"> נוסף בהצלחה</button> :
                                        <button className="addToCartBtnBook">הוסף לסל</button>}
                                </div>
                                <span className="delivery-condition">משלוח חינם בארץ בקניה מעל $249 בכפוף למדיניות המשלוחים</span>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

        </div>
    )
}

export default DisplayBook