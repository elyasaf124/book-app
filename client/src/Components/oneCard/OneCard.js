import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './oneCard.css'
import { baseUrl } from '../..'
import { setUserDetails } from '../../features/loginMoodSlice'
import { useDispatch } from 'react-redux'


function OneCard(props) {
    const dispatch = useDispatch()
    const [inCart, setInCart] = useState(false)

    const navigate = useNavigate()

    const goToBook = () => {
        navigate(`/book/${props.item._id}`)
    }

    const addToCart = async (e) => {
        e.stopPropagation()
        axios.create({ withCredentials: true }).post(`${baseUrl}/booking/addToCart`, {
            bookId: props.item._id,
            quantityBook: 1
        })
            .then(res => {
                dispatch(setUserDetails(res.data.user))
                setInCart(true)
                setTimeout(() => {
                    setInCart(false)
                }, 2000);
            })
            .catch(error => {
                alert(error.response.data.message)
            });
    }

    return (
        <div className='bigCard'>
            <div className='cardContainer'>
                <div onClick={goToBook} className='bookItemContainer'>
                    <img className='imgCard' src={props.item.image} />
                    <span className='titleBook'>{props.item.title}</span>
                    <span className='autherBook'>{props.item.author}</span>

                    <div className='priceContainer'>
                        <span className='bookPrice1'><del>${props.item.price}</del></span>
                        <span className='bookPriceSale'>${props.item.priceSale}</span>
                    </div>
                    <div className='btnContainer' onClick={(e) => addToCart(e)}>
                        {
                            inCart ? <button className='addToCartBtn addToCartBtnSuccessfully'> הוסף בהצלחה</button> :
                                <button className='addToCartBtn'>הוסף לסל</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OneCard