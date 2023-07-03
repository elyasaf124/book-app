import './cart.css'
import Footer from '../footer/Footer'
import FotterContact from '../fotterContact/FotterContact'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Loading from '../loading/Loading'
import { baseUrl } from '../..'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../../features/loginMoodSlice'

const stripe = loadStripe('pk_test_51MAVaHLgdlizbrsatIT0ALh0HeqXtWprxvf8ZJSUfjhuFdfx4OgTyppH9qVfiwyCP2Sb8sxLvZtmiteaJDEF2OgC00nJff7jeH');


function Cart() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [myCart, setMyCart] = useState([])
    const [confirmTerms, setConfirmTerms] = useState(false)
    const [showErrorConfiem, setShowErrorConfiem] = useState(false)
    const [showErrorAddress, setShowErrorAddress] = useState(false)
    const [cardUpdateBtnClass, setCardUpdateBtnClass] = useState(false)
    const [cartCount, setCartCount] = useState()
    const [valueShipping, setValueShipping] = useState(Number)
    const [totalPriceCart, setTotalsPriceCart] = useState(Number)
    const [bol, setBol] = useState(false)
    const [addressDetails, setAddressDetails] = useState({
        city: undefined,
        street: undefined,
        numberHome: undefined,
        postalcode: undefined,
        country: undefined,
    })
    let totalCartPrice = 0
    let cartCountNumber = 0

    const handleChangeAddress = (e) => {
        setAddressDetails({ ...addressDetails, [e.target.id]: e.target.value })
        console.log(addressDetails)
    }

    useEffect(() => {
        try {
            axios.create({ withCredentials: true }).get(`${baseUrl}/users/myCart`)
                .then(res => {
                    const arr = res.data.data.cart
                    cartCountNumber = 0
                    arr.map(el => {
                        el.type.totalPrice = el.type.priceSale * el.quantity || el.type.price * el.quantity
                        cartCountNumber += el.quantity
                    })
                    let total = 0
                    arr.map(item => {
                        if (item.type.priceSale < item.type.price) {
                            total += item.type.priceSale * item.quantity
                        } else {
                            total += item.type.price * item.quantity
                        }
                    })
                    setLoading(false)
                    setMyCart(arr)
                    setTotalsPriceCart(total)
                    setCartCount(cartCountNumber)
                })
        } catch (error) {
            console.log((error))
        }
    }, [])

    const updateCartCount = (e, item) => {
        if (e === '-') {
            setCartCount(cartCount - item.quantity)
        }
        if (e === '+') {
            setCartCount(cartCount + item.quantity)
        }
    }

    const totalPrice = (updatedCart) => {
        if (updatedCart) {
            updatedCart.forEach(el => {
                totalCartPrice += +el.type.totalPrice
            })
        } else {
            myCart.forEach(el => {
                totalCartPrice += +el.type.totalPrice
            })

        }
        setTotalsPriceCart(totalCartPrice)
    }

    const inc = (e, item) => {
        setMyCart([...myCart], item.quantity = +e.target.value)
        setMyCart([...myCart], item.type.totalPrice = +e.target.value * [item.type.priceSale || item.type.price])
        totalPrice()
        myCart.forEach(el => {
            cartCountNumber += +el.quantity
        })
        setCartCount(cartCountNumber)
        updateCartCount('+', e.target.value)
    }

    const removeItem = async (item) => {
        let updatedCartFilter

        try {
            await axios.create({ withCredentials: true }).patch(`${baseUrl}/booking/deleteItem`, {
                bookDelete: item.type
            }).then(async res => {
                if (res.data.status == 'success') {
                    dispatch(setUserDetails(res.data.user))
                    updatedCartFilter = myCart.filter(el => {
                        return el.type._id !== item.type._id
                    })
                    setBol(!bol)
                    setMyCart(updatedCartFilter)
                }
                totalPrice(updatedCartFilter)
            })

        } catch (error) {
            console.log((error))
        }
    }

    const buyNow = async () => {
        localStorage.setItem('myArray', JSON.stringify(myCart));
        const line_items = myCart.map(book => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        images: [book.type.image],
                        name: book.type.title,
                        description: book.type.description.slice(0, 500) + '...',
                    },
                    unit_amount: book.type.priceSale * 100 || book.type.price * 100,
                },
                quantity: book.quantity
            }
        })
        const Stripe = await loadStripe('pk_test_51MAVaHLgdlizbrsatIT0ALh0HeqXtWprxvf8ZJSUfjhuFdfx4OgTyppH9qVfiwyCP2Sb8sxLvZtmiteaJDEF2OgC00nJff7jeH');
        await axios.create({ withCredentials: true }).post(`${baseUrl}/booking/create-checkout-session`, {
            line_items
        }).then(async res => {
            const { sessionId } = res.data;
            if (stripe) {
                const { error } = await Stripe.redirectToCheckout({
                    sessionId,
                });
                if (error) {
                    console.log(error);
                }
            }
        })
    }

    const updateCart = async () => {
        try {
            localStorage.setItem('cartCount', cartCount);
            await axios.create({ withCredentials: true }).patch(`${baseUrl}/booking/updateCart`, {
                updateCart: myCart
            }).then((res) => {
                dispatch(setUserDetails(res.data.data.user))
                setCardUpdateBtnClass(true)
                setTimeout(() => {
                    setCardUpdateBtnClass(false)
                }, 2000);
            })
        } catch (error) {
            console.log(error)
        }
    }

    const load = () => {
        if (loading === true) {
            return <Loading />
        } else {
            return <p className='cartEmpty'>your cart is empty</p>
        }
    }

    if (!myCart) {
        return (
            <Loading />
        )
    }

    return (
        <div className='cart'>
            <div className='cartContainer'>
                <div className='cartRow'>
                    <div className='cartTitleContainer'>
                        <span className='cartTitle'>סל קניות</span>
                    </div>
                </div>
            </div>
            <p className='msgCart'>
                כל ההנחות והמבצעים הינם מהמחירים הקטלוגיים של המוצרים
                <br />
                לא ניתן לשלם בכרטיסי חיוב מיידי
            </p>
            <div className='products'>
                <div className='productsContainer'>
                    <div className='ProductCriteria'>
                        <span className='table-call nameProduct tab'>שם מוצר</span>
                        <span className='table-call mkt tab'>מק"ט</span>
                        <span className='table-call quantity tab'>כמות</span>
                        <span className='table-call price tab'>מחיר קטלוגי</span>
                        <span className='table-call priceSale tab'>מחיר לאחר הנחה</span>
                        <span className='table-call total tab'>סה"כ</span>
                        <span className='table-call tab'></span>
                    </div>
                    {
                        myCart.length === 0 ? load() : myCart.map(item => {
                            return (
                                <div key={item.type._id} className='ProductDetail'>
                                    <div className='table-call paddingB'>{item.type.title}</div>
                                    <span className='table-call'>32165489561231</span>
                                    <select defaultValue={item.quantity} onChange={(e) => inc(e, item)} className='table-call select'>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                        <option value='9'>9</option>
                                    </select>
                                    <span className='table-call'> {item.type.price} ₪ </span>
                                    <span className='table-call'> {item.type.priceSale} ₪</span>
                                    <span className='table-call'> {item.type.priceSale * item.quantity || item.type.price * item.quantity} ₪</span>
                                    <ion-icon onClick={() => removeItem(item)} class='deleteIcon table-call' name="close-outline"></ion-icon>
                                </div>
                            )
                        })
                    }
                    {cardUpdateBtnClass === true ?
                        <button className='updateCardSuccess' onClick={updateCart}>update success</button> :
                        <button className='cardUpdateBtn' onClick={updateCart}>update cart</button>}

                </div>
            </div>
            <div className='shippingAndOrderSummary'>
                <div className='shippingAndOrderSummaryContainer'>
                    <div className='shipping'>
                        <div className='shippingContainer'>
                            <p className='shippingTitle'>בחירת משלוח והזנת קופון</p>
                            <form className='shippingForm'>
                                <div className='shippingLabelContainer'>
                                    <label>אופן המשלוח</label>
                                    <select onChange={(e) => setValueShipping(e.target.value)} className='selectShip' placeholder='בחר'>
                                        <option value='0'>איסוף עצמי</option>
                                        <option value='20'>שליח עד הבית</option>
                                        <option value='30'>משלוח לחו"ל</option>
                                    </select>
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>מספר תשלומים</label>
                                    <select className='selectShip'>
                                        <option value='1'>1 תשלומים</option>
                                        <option value='2'>2 תשלומים</option>
                                    </select>
                                </div>
                                <div className='shippingcuponContainer'>
                                    <label>קופון</label>
                                    <div className='cuponContainer'>
                                        <input className='cuponInput' />
                                        <button className='cuponBtn'>שליחה</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='orderSummery'>
                        <p className='orderTitle'>סיכום הזמנה</p>
                        <div className='priceLabelContainer'>
                            <label>סה"כ לפני משלוח</label>
                            <span> {totalPriceCart} ₪</span>
                        </div>
                        <div className='shippingLabelContainer'>
                            <label>משלוח</label>
                            <span> {valueShipping} ₪</span>
                        </div>
                        <div className='totalShipingContainer'>
                            <label>סה"כ לתשלום</label>
                            <span> {+valueShipping + +totalPriceCart} ₪</span>
                        </div>
                    </div>
                </div>
            </div >
            <div className='userDetailsAndAddress'>
                <div className='userDetailsAndAddressContainer'>
                    <div className='userDetails'>
                        <div className='userDetailsContainer'>
                            <p className='userDetailsTitle'>פרטים אישיים</p>
                            <form className='userDetailsForm'>
                                <div className='userDetailsLabelContainer'>
                                    <label>דואר אלקטרוני<span className='requiredInput'> *</span></label>
                                    <input placeholder='email...' type='email' className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>שם פרטי<span className='requiredInput'> *</span></label>
                                    <input placeholder='name...' className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>שם משפחה</label>
                                    <input placeholder='last name...' className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>סלולרי<span className='requiredInput'> *</span></label>
                                    <input placeholder='tel...' type='tel' className='inputUserDetails' />
                                </div>

                            </form>
                        </div>
                    </div>
                    <div className='shippingAddress'>
                        <div className='shippingAddressContainer'>
                            <p className='shippingAddressTitle'>כתובת למשלוח</p>
                            <form className='shippingAddressForm'>
                                {showErrorAddress ? <span className='showErrorAddress'>נא למלא את כל השדות המסומנים ב *</span> : null}
                                <div className='shippingAddressLabelContainer'>
                                    <label>עיר<span className='requiredInput'> *</span></label>
                                    <input id='city' onChange={handleChangeAddress} className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>רחוב<span className='requiredInput'> *</span></label>
                                    <input id='street' onChange={handleChangeAddress} className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>מספר<span className='requiredInput'> *</span></label>
                                    <input id='numberHome' onChange={handleChangeAddress} className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>מיקוד<span className='requiredInput'> *</span></label>
                                    <input id='postalcode' onChange={handleChangeAddress} className='inputUserDetails' />
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>מדינה<span className='requiredInput'> *</span></label>
                                    <input id='country' onChange={handleChangeAddress} className='inputUserDetails' />
                                </div>
                                <div className='checkboxContainer'>
                                    <input type='checkbox' class='checkbox' />
                                    <span className='checkboxText'>זו אינה הכתובת שלי</span>
                                </div>
                                <div className='shippingLabelContainer'>
                                    <label>שם הנמען</label>
                                    <input className='inputUserDetails' />
                                </div>
                                <div className='remarkContainer'>
                                    <p className='remark'>הערות</p>
                                    <div className='textareaContainer'>
                                        <textarea placeholder='הערות להזמנה' className='textarea' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='termsAndBuy'>
                {showErrorConfiem ? <span className='confirmTermsError'> * בבקשה אשר את התנאים</span> : null}
                <div className='confirmTerms'>
                    <input onChange={() => setConfirmTerms(!confirmTerms)} type='checkbox' />
                    <p className='termsText'>אני מאשר כי קראתי את התקנון ותנאי השימוש ואני מסכים להם</p>
                </div>
                <div className='confirmNews'>
                    <input type='checkbox' />
                    <p className='termsText'>אני מעונין לקבל עדכונים על חדשות ומבצעים באתר</p>
                </div>
            </div>
            <button onClick={buyNow} className='buyBtn'>לתשלום</button>
            <FotterContact />
            <Footer />
        </div>
    )
}

export default Cart