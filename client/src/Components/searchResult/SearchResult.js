import axios from "axios"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import OneCard from "../oneCard/OneCard";
import './searchResults.css'
import { baseUrl } from "../..";

const SearchResult = () => {
    const searchs = useLocation().search;
    const search = new URLSearchParams(searchs).get('search');
    const cate = new URLSearchParams(searchs).get('cate');
    const sortBy = new URLSearchParams(searchs).get('sortBy');

    let navigate = useNavigate('');

    const [book, setBook] = useState([])
    const [sort, setSort] = useState('')

    useEffect(() => {
        let isCancelled = false
        try {
            axios.create({ withCredentials: true }).get(`${baseUrl}/books/search?search=${search}`)
                .then(res => {
                    setBook(res.data.data1)
                })
        } catch (error) {
            console.log(error)
        }
        return () => {
            isCancelled = true
        }
    }, [])

    function compereByAtribute(att) {
        return function (a, b) {
            if (a[att] < b[att]) {
                return -1;
            }
            if (a[att] > b[att]) {
                return 1;
            }
            return 0;
        }
    }

    const sorting = async (e) => {
        let sortV = e.target.value
        setSort(e.target.value)
        let data = book.sort(compereByAtribute(e.target.value))
        setBook(data)
        if (sortBy && cate) {
            return navigate(`?search=${search}&cate=${cate}&sortBy=${sort}`)
        }
        if (sort) {
            navigate(`?search=${search}&sortBy=${sortV}`)
        }

    }

    const changeSort = (e) => {
        setSort(e.target.value)
    }

    if (book === undefined) {
        return <></>
    }
    return (
        <div className="searchResults">
            <div className="pathContainerSearchResults">
                <div className="path"><a href="/" className="pathAtagSearchResults">דף הבית</a> &gt; {search}</div>
            </div>
            <div className='searchResultsContainer'>
                <div className='searchResultsRow'>
                    <div className='searchResultsTitleContainer'>
                        <span className='searchResultsTitle'> תוצאות חיפוש: {search}</span>
                    </div>
                </div>
            </div>
            <span className="countResults">{book.length >= 1 ? `${book.length} מוצרים נמצאו` : "0 מוצרים נמצאו"}</span>
            <div className="sortBtnContainer">
                <select defaultValue='select' placeholder="select..." className="selectSort" onChange={(e) => sorting(e)}>
                    {/* <option>select</option> */}
                    <option>price</option>
                    <option>pages</option>
                    <option value='year'>date</option>
                </select>
            </div>
            <div className="resultContainer">
                {book.length >= 1 ? book.map(item => {
                    return (
                        <OneCard key={item._id} item={item} />
                    )
                }) : null}

            </div>
        </div>
    )
}

export default SearchResult