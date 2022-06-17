import React, {useState, useEffect} from 'react';

import {Categories} from "../components/Categories";
import {Sort} from "../components/Sort";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import {PizzaBlock} from "../components/PizzaBlock/PizzaBlock";
import Pagination from "../Pagination/Pagination";


const Home = ({searchValue}) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [categoryId, setCategoryId] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortType, setSortType] = useState({
        name: 'популярности',
        sortProperty: 'Rating'
    })


    useEffect(() => {
        setIsLoading(true)

        const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc'
        const sortBy =sortType.sortProperty.replace('-', '')
        const  category =categoryId > 0 ? `category=${categoryId}` : ''
        const  search =searchValue ? `&search=${searchValue}` : ''

        fetch(
            `https://62a97197ec36bf40bdb79673.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`)
            .then((res) => {return res.json()})
            .then((arr) => {
                setItems(arr)
                setIsLoading(false)
            })
        window.scroll(0,0)
    }, [categoryId, sortType, searchValue, currentPage])

    const pizzas = items
        .map((obj) => <PizzaBlock key={obj.id} {...obj}/>)
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={(i)=>setCategoryId(i)}/>
                <Sort value={sortType} onChangeSort={(i)=>setSortType(i)}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {isLoading ? skeletons : pizzas}
            </div>
            <Pagination currentPage={currentPage} onChangePage={(number)=> setCurrentPage(number)}/>
        </div>
    );
};

export default Home;