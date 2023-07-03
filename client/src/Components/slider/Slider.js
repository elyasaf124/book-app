import './slider.css'
import { useState } from 'react';

const Slider = () => {
    const [index, setIndex] = useState(0)

    const images = [
        "https://www.booknet.co.il/images/site/pages/d_1799_auto_5cf7f9da-c0db-42bc-9336-63c0ef3f505b.jpg",
        "https://www.booknet.co.il/images/site/pages/d_1799_auto_626565b3-e113-47d5-92b3-669861a42400.jpg",
        "https://www.booknet.co.il/images/site/pages/d_1799_auto_edf25888-3c51-4c7d-bfa3-44999de1bbdb.jpg",
    ];

    let timerTime

    //option
    const timer = () => {
        timerTime = setTimeout(() => {
            if (index == images.length - 1) {
                return setIndex(0)
            }
            setIndex(index + 1)
        }, 2000);
    }
    const sliderPrev = () => {
        clearTimeout(timerTime)
        if (index == 0) {
            return setIndex(images.length - 1)
        }
        setIndex(index - 1)
    }

    const sliderNext = () => {
        clearTimeout(timerTime)
        if (index == images.length - 1) {
            return setIndex(0)
        }
        setIndex(index + 1)
    }

    const dotBtn = (e) => {
        clearTimeout(timerTime)
        setIndex(+e.target.id)
    }

    return (
        <div className="slider">
            <div className="sliderContainer">
                <div className='arrowContainer'>
                    <ion-icon onClick={sliderPrev} class='btnSlider left' name="arrow-back-circle-outline"></ion-icon>
                    <ion-icon onClick={sliderNext} class='btnSlider right' name="arrow-forward-circle-outline"></ion-icon>
                </div>
                <div className='imgSliderContainer'>
                    {images.map((el, i) => {
                        return <img key={el} className={index === i ? 'imgSlider active' : 'imgSlider'} src={el} />
                    })}
                </div>
            </div>
            <div className='circleContainer'>
                <div id='2' onClick={(e) => dotBtn(e)} className={index == 2 ? 'circle active' : 'circle'}></div>
                <div id='1' onClick={(e) => dotBtn(e)} className={index == 1 ? 'circle active' : 'circle'}></div>
                <div id='0' onClick={(e) => dotBtn(e)} className={index == 0 ? 'circle active' : 'circle'}></div>
            </div>
        </div>
    )

}
export default Slider