import './addBook.css'
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from '../..';

function AddBook() {
    const api_key = process.env.CLUDINARY_API_KEY
    const cloudname = process.env.CLUDENAME

    let userDetails = useSelector((state) => state.user)

    const [book, setBook] = useState({
        title: '',
        author: '',
        categories: [],
        year: Number,
        language: '',
        image: '',
        pages: Number,
        description: '',
        uploadBy: userDetails?._id
    })

    const onChange = (e, data) => {
        if (e === 'image') {
            return setBook((prev) => ({ ...prev, image: data }))

        }
        if (e.target.id === 'image') {
            return setBook((prev) => ({ ...prev, [e.target.id]: e.target.files[0] }))
        }
        setBook((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }



    const createBook = async (e) => {
        e.preventDefault();
        try {
            const signatureResponse = await axios.create({ withCredentials: true }).get(`${baseUrl}/books/get-signature`);
            const { signature, timestamp } = signatureResponse.data;
            const data = new FormData();
            data.append("file", book.image);

            const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload?api_key=${api_key}&timestamp=${timestamp}&signature=${signature}`, data, {
                onUploadProgress: function (e) {
                    console.log("2", e.loaded / e.total)
                }
            })

            const photoData = {
                public_id: cloudinaryResponse.data.public_id,
                version: cloudinaryResponse.data.version,
                signature: cloudinaryResponse.data.signature,
                secure_url: cloudinaryResponse.data.secure_url
            };

            await axios.create({ withCredentials: true }).post(`${baseUrl}/books/sendBookToConfirm`, {
                book: {
                    ...book,
                    image: photoData
                }
            })
        } catch (error) {
            console.log("Error creating book:", error.response ? error.response.data.message : error.message);
            alert(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <>
            <div className="addBook">
                <div className="addBookContainer">
                    <h1 className="addBookTitle">Add Book</h1>
                    <form className="addBookForm" onSubmit={createBook}>
                        <label className="textLabel">כותרת</label>
                        <input id="title" onChange={(e) => onChange(e)} placeholder="כותרת..." />
                        <label className="textLabel">שם הסופר</label>
                        <input id='author' onChange={(e) => onChange(e)} placeholder="שם הסופר..." />
                        <label className="textLabel">קטגוריות</label>
                        <input id='categories' onChange={(e) => onChange(e)} placeholder="קטגוריות..." />
                        <label className="textLabel">שנת יציאה</label>
                        <input id='year' onChange={(e) => onChange(e)} placeholder="שנת יציאה..." />
                        <label className="textLabel">שפות</label>
                        <input id='language' onChange={(e) => onChange(e)} placeholder="שפות..." />
                        <label className="textLabel">תמונת הספר</label>
                        <input type='file' id='image' onChange={(e) => onChange(e)} placeholder="תמונת הספר..." />
                        <label className="textLabel">מספר עמודים</label>
                        <input id='pages' onChange={(e) => onChange(e)} placeholder="מספר עמודים..." />
                        <label className="textLabel">תקציר</label>
                        <input id='description' onChange={(e) => onChange(e)} placeholder="תקציר..." />
                        <button onClick={createBook}>שלח ספר</button>

                    </form>
                </div>
            </div>
        </>
    );
}

export default AddBook;