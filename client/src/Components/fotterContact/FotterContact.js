import './fotterContact.css'

function FotterContact() {
    return (
        <div className='footer-contect'>
            <div className='footerContectContainer'>
                <div className='service-contect-container'>
                    <div className='iconContainer CellContainer'>
                        <ion-icon class='icon cell' name="call-outline"></ion-icon>
                    </div>
                    <div className='text-container'>
                        <h5 className='titleContect'>שירות הלקוחות שלנו</h5>
                        <p className='text-contect'>צומת ספרים - 08-9236565
                            <br />
                            בימים א'-ה' בין השעות 09:00-17:00</p>
                    </div>
                </div>
                <div className='branches-container'>
                    <div className='service-contect-container'>
                        <div className='iconContainer LocationContainer'>
                            <ion-icon class='icon location' name="location"></ion-icon>
                        </div>
                        <div className='text-container'>
                            <h5 className='titleContect'>סניפים</h5>
                            <p className='text-contect'>מעוניינים לדעת מהו
                                <br />
                                הסניף הקרוב לביתך? לחץ כאן</p>
                        </div>
                    </div>
                </div>
                <div className='newsletter-container'>
                    <div className='service-contect-container'>
                        <div className='iconContainer MailContainer'>
                            <ion-icon class='icon mail' name="mail"></ion-icon>
                        </div>
                        <div className='text-container'>
                            <h5 className='titleContect'>רוצים לדעת לפני כולם?</h5>
                            <p className='text-contect'>הירשמו לניוזלטר שלנו
                                <br />
                                וקבלו מבצעים בלעדיים
                                <br />
                                ועדכונים חמים לפני כולם!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FotterContact