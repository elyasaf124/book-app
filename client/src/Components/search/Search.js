import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './search.css'
import { baseUrl } from "../..";

const Search = (props) => {
    const [search, setSearch] = useState('')
    let navigate = useNavigate();

    const searchFun = async () => {
        let cateObj = Object.fromEntries(Object.entries(props.box).filter(([key, value]) => value === true));
        let cate = Object.keys(cateObj).map(key => key).join(',');
        const url = cate ?
            `${baseUrl}/books/search?search=${search}&cate=${cate}` :
            `${baseUrl}/books/search?search=${search}`
        try {
            axios.create({ withCredentials: true }).get(url)

            const urlNavigate = cate ?
                `/searchResult?search=${search}&cate=${cate}&sortBy=price` :
                `/searchResult?search=${search}&sortBy=price`
            navigate(urlNavigate)
        } catch (error) {
            console.log((error))
        }
    }

    return (
        <div  >
            <input onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
            <button onClick={searchFun}>Search</button>
        </div>

    );
};

export default Search