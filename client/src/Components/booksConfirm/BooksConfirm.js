import React, { useEffect, useState } from 'react'
import './booksConfirm.css'
import axios from 'axios'
import DisplayBookConfirm from '../displayBookConfirm/DisplayBookConfirm'
import { baseUrl } from '../..'

const BooksConfirm = () => {
    const [bookList, setListBook] = useState([])

    const deleteBook = (bookItem) => {
        setListBook(bookList.filter(book => {
            return book._id !== bookItem._id
        }))

    }

    useEffect(() => {
        axios.get(`${baseUrl}/books/getAllBooksConfirm`).then(res => {
            setListBook(res.data.data.books)
        })
    }, [])
    return (
        <div className='booksConfirm' >
            <div className='bookConfirmContainer'>
                <select>
                    {bookList.map(book => {
                        return <option>{book.title}</option>
                    })}
                </select>
                <div className='container'>
                    {bookList.map(book => {
                        return <DisplayBookConfirm key={book._id} deleteBookProps={deleteBook} book={book} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default BooksConfirm