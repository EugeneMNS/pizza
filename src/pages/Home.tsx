import React, {useEffect, useRef} from 'react';
import qs from 'qs';
import {Link, useNavigate} from 'react-router-dom';


import {Categories} from "../components/Categories";
import {Sort, sortList} from "../components/Sort";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import {PizzaBlock} from "../components/PizzaBlock/PizzaBlock";
import Pagination from "../Pagination/Pagination";
import {useSelector, useDispatch} from 'react-redux'
import {selectFilter, setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import {fetchPizzas, selectPizzaData} from "../redux/slices/pizzaSlice";


const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {categoryId, sort, currentPage, searchValue} = useSelector(selectFilter)
    const isSearch = useRef(false)
    const isMounted = useRef(false)
    const {items, status} = useSelector(selectPizzaData)


    const onChangeCategory = (idx: number) => {
        dispatch(setCategoryId(idx))
    }

    const onChangePage = (page:number) => {
        dispatch(setCurrentPage(page));
    };

    const getPizzas = async () => {

        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
        const sortBy = sort.sortProperty.replace('-', '')
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''


        // @ts-ignore
        dispatch(fetchPizzas({
                order,
                sortBy,
                category,
                search,
                currentPage,
            })
        )
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
            getPizzas()
        }

        isSearch.current = false
    }, [categoryId, sort.sortProperty, searchValue, currentPage])


    const pizzas = items
        .map((obj: any) => (
            <Link key={obj.id} to={`/pizza/${obj.id}`}>
                <PizzaBlock  {...obj}/>
            </Link>
        ))
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
                <Sort/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                    <div className='content__error-info'>
                        <h2>Произошла ошибка</h2>
                        <p>Попробуйте повторить попытку позже</p>
                    </div>
                )
                : <div className="content__items">
                    {status === 'loading' ? skeletons : pizzas}
                </div>
            }

            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    );
};

export default Home;