import axios from "axios";
import React, { useEffect, useState } from "react";
import OneCard from "../oneCard/OneCard";
import './mybooks.css'
import { baseUrl } from "../..";

function MyBooks() {
    const [myBooks, setMyBooks] = useState([])

    useEffect(() => {
        try {
            axios.create({ withCredentials: true }).get(`${baseUrl}/users/myBooks`)
                .then(res => {
                    setMyBooks(res.data.data.books)
                })
        } catch (error) {

        }
    }, [])

    return (
        <div>
            <h1>my books</h1>
            {myBooks.map(item => {
                return <OneCard key={item._id} item={item} />
            })}

        </div>
    );
}

export default MyBooks;