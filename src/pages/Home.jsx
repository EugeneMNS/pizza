import React, {useState, useEffect, useContext, useRef} from 'react';
import axios from "axios";
import qs from 'qs';
import {useNavigate} from 'react-router-dom';


import {Categories} from "../components/Categories";
import {Sort, sortList} from "../components/Sort";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import {PizzaBlock} from "../components/PizzaBlock/PizzaBlock";
import Pagination from "../Pagination/Pagination";
import {SearchContext} from "../App";
import {useSelector, useDispatch} from 'react-redux'
import {setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";


const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {categoryId, sort, currentPage} = useSelector((state) => state.filter)
    const isSearch = useRef(false)
    const isMounted = useRef(false)


    const {searchValue} = useContext(SearchContext)
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true)


    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number));
    };

    const fetchPizzas = async () => {
        setIsLoading(true)

        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
        const sortBy = sort.sortProperty.replace('-', '')
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''


        try{
            const res = await axios.get(`https://62a97197ec36bf40bdb79673.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`)
            setItems(res.data)
        } catch (error){
            console.log('Error: ', error);
            alert('Ошибка при загрузке данных')
        } finally{
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage,
            })

            navigate(`?${queryString}`)
        }
        isMounted.current = true
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1))
            const sort = sortList.find(obj => obj.sortProperty === params.sortProperty)

            dispatch(
                setFilters({
                    ...params,
                    sort,
                })
            )
            isSearch.current = true
        }
    }, [])

    useEffect(() => {
        window.scroll(0, 0)
        if (!isSearch.current) {
            fetchPizzas()
        }

        isSearch.current = false
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
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    );
};

export default Home;