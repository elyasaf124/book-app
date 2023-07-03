import React from 'react'
import './displayBookConfirm.css'
import axios from 'axios'
import { baseUrl } from '../..'

const DisplayBookConfirm = ({ book, deleteBookProps }) => {
    const deleteBook = (book) => {
        console.log(book._id)
        axios
            .delete(`${baseUrl}/books/bookConfirm/${book._id}`, { withCredentials: true })
            .then(() => {
                deleteBookProps(book)
            })
            .catch((error) => {
                alert(error);
            });
    }

    const addBook = (bookItem) => {
        axios
            .post(`${baseUrl}/books`, { book }, { withCredentials: true })
            .then((res) => {
                if (res.data.status === 'success') {
                    alert('book add successfully')
                    deleteBookProps(book)
                }
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    };

    return (
        <>
            <table className="bookTable">
                <tbody className='bookTableContainer'>
                    <tr>
                        <td className="table-header">Image</td>
                        <td><img className='imgConfirmBook' src={book.image.secure_url} /></td>
                    </tr>
                    <tr>
                        <td className="table-header">ID</td>
                        <td>{book._id}</td>
                    </tr>
                    <tr>
                        <td className="table-header">Categories</td>
                        <td>{book.categories.join(', ')}</td>
                    </tr>
                    <tr>
                        <td className="table-header">Title</td>
                        <td>{book.title}</td>
                    </tr>
                    <tr>
                        <td className="table-header">Author</td>
                        <td>{book.author}</td>
                    </tr>
                    <tr>
                        <td className="table-header">Year</td>
                        <td>{book.year}</td>
                    </tr>
                    <tr>
                        <td className="table-header">Language</td>
                        <td>{book.language}</td>
                    </tr>

                    <tr>
                        <td className="table-header">Pages</td>
                        <td>{book.pages}</td>
                    </tr>
                    <tr className='descContainerz'>
                        <td className="table-header">Description</td>
                        <td>{book.description}</td>
                    </tr>
                    <tr>
                        <td className="table-header">Upload By</td>
                        <td>{book.uploadBy}</td>
                    </tr>
                    <div className='btn-container'>
                        <button onClick={() => deleteBook(book)} className='bookBtn delete'>הסר מהרשימה</button>
                        <button onClick={() => addBook(book)} className='bookBtn add'>הוסף ספר</button>
                    </div>
                </tbody>
            </table>

        </>
    )
}

export default DisplayBookConfirm