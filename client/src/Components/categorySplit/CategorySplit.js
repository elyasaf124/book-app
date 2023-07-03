import { useState } from 'react';
import Loading from '../loading/Loading';
import OneCard from '../oneCard/OneCard';
import './categorySplit.css'

function CategorySplit(props) {
    const [state1, setState1] = useState(false)

    const handleClick = () => {
        setState1(!state1)
    }

    return (
        <div className='allSplit'>
            <div className='categorySplit'>
                <div className='categorySplitContainer'>
                    <div className='displayAll'>הצג הכל</div>
                    <ion-icon class='arrow' name="chevron-back-outline"></ion-icon>
                    <h2 className='split'>
                        <span className='textCategory'>50% הנחה על הספר השני מגוון רבי מכר  </span>
                    </h2>
                </div>
                {
                    props.loading === true ? <Loading /> : <div className='con'>
                        <div className='cardsContainer'>
                            <div className={state1 ? 'allCards active' : 'allCards'}>
                                {props.item.map(item => {
                                    return (
                                        <OneCard key={item._id} item={item} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className='arrows'>
                <div className='arrowsContainer'>
                    <ion-icon onClick={handleClick} class='icon right' name="chevron-forward-outline"></ion-icon>
                    <ion-icon onClick={handleClick} class='icon left' name="chevron-back-outline"></ion-icon>
                </div>
            </div>
        </div>
    )
}


export default CategorySplit;