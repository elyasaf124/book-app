import React, { useEffect, useState } from "react";
import axios from "axios"
import './home.css'
import CategorySplit from "../categorySplit/CategorySplit";
import Slider from "../slider/Slider";
import { useSelector } from "react-redux";
import { baseUrl } from "../..";

function HomePage() {

    const [loading, setLoading] = useState(true)
    const [comedyBooks, setComedy] = useState([])
    const [sportBooks, setSport] = useState([])
    const [actionBooks, setAction] = useState([])

    useEffect(() => {
        let isCancelled = false
        let booksArr = []
        let comedyBook = []
        let sportBook = []
        let actionBook = []

        axios.get(`${baseUrl}/books`)
            .then(async res => {
                res.data.data.books.map(el => {
                    booksArr.push(el)
                })
                comedyBook = booksArr.filter(el => el.categories == 'comedy')
                sportBook = booksArr.filter(el => el.categories == 'sport')
                actionBook = booksArr.filter(el => el.categories == 'action')
                setAction(actionBook)
                setSport(sportBook)
                setComedy(comedyBook)
                setLoading(false)

            })
        return () => {
            isCancelled = true
        }
    }, [])


    return (
        <>
            <Slider />
            <CategorySplit loading={loading} item={actionBooks} />
            <CategorySplit loading={loading} item={sportBooks} />
            <CategorySplit loading={loading} item={comedyBooks} />
        </>
    )
}

export default HomePage