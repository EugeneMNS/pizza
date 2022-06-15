import logo from './logo.svg';
import './App.css';
import './scss/app.scss'
import {Header} from "./components/Header";
import {Categories} from "./components/Categories";
import {Sort} from "./components/Sort";
import {PizzaBlock} from "./components/PizzaBlock";
// import pizzas from './assets/pizzas.json'
import {useEffect, useState} from "react";


function App() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('https://62a97197ec36bf40bdb79673.mockapi.io/items')
            .then((res) => {return res.json();})
            .then((arr) => {
                setItems(arr)
            })
    }, [])

    return (
        <div className="wrapper">
            <Header/>
            <div className="content">
                <div className="container">
                    <div className="content__top">
                        <Categories/>
                        <Sort/>
                    </div>
                    <h2 className="content__title">Все пиццы</h2>
                    <div className="content__items">
                        {
                            items.map((obj) =>
                                <PizzaBlock key={obj.id}
                                            {...obj}
                                    /* title={obj.title}
                                     price={obj.price}
                                     imageUrl={obj.imageUrl}
                                     sizes={obj.sizes}
                                     types={obj.types}*/
                                />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
