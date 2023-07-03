import './footer.css'

function Footer() {
    return (
        <div className='footer'>
            <div className='footer-container'>
                <div className='imgContainer'>
                    <img className='imgLogo' src='https://www.booknet.co.il/images/footer-logo.png' />
                </div>
                <div className='listContainer'>
                    <ul className='list'>
                        <li>בלוג</li>
                        <li>מעקב משלוחים</li>
                        <li>פרופיל חברה</li>
                        <li>סניפים</li>
                        <li>דרושים</li>
                    </ul>
                    <ul className='list'>
                        <li>תקנון ותנאי שימוש</li>
                        <li>תקנון מועדון לקוחות</li>
                        <li>תקנון כרטיסי מתנה</li>
                        <li>המלצות ספרים</li>
                    </ul>
                    <ul className='list'>
                        <li>קניות מרוכזות</li>
                        <li>מדיניות משלוחים</li>
                        <li>הצהרת נישות</li>
                        <li>מדיניות החזרת מוצרים סניפי הרשת</li>
                    </ul>
                    <ul className='list'>
                        <li>צור קשר</li>
                        <li>החשבון שלי</li>
                        <li>ספרים חדשים</li>
                        <li>פאזלים</li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default Footer