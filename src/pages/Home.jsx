import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";

import {Categories} from "../components/Categories";
import {Sort} from "../components/Sort";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import {PizzaBlock} from "../components/PizzaBlock/PizzaBlock";
import Pagination from "../Pagination/Pagination";
import {SearchContext} from "../App";
import {useSelector, useDispatch} from 'react-redux'
import {setCategoryId} from "../redux/slices/filterSlice";


const Home = () => {
    const dispatch = useDispatch()
    const {categoryId, sort} = useSelector((state) => state.filter)


    const {searchValue} = useContext(SearchContext)
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)


    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    useEffect(() => {
        setIsLoading(true)

        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
        const sortBy = sort.sortProperty.replace('-', '')
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''

        axios
            .get(`https://62a97197ec36bf40bdb79673.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
            )
            .then((res) => {
                setItems(res.data)
                setIsLoading(false)
            })
        window.scroll(0, 0)
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    const pizzas = items
        .map((obj) => <PizzaBlock key={obj.id} {...obj}/>)
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
                <Sort/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {isLoading ? skeletons : pizzas}
            </div>
            <Pagination currentPage={currentPage} onChangePage={(number) => setCurrentPage(number)}/>
        </div>
    );
};

export default Home;