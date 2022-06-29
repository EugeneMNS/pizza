import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {RootState} from "../store";
import {CartItem} from "./cartSlice";

type Pizza ={
    id:string
    title:string
    price:number
    imageUrl:string
    sizes: number[]
    types: number[]
}
interface PizzaSliceSate {
    items: Pizza[];
    status: Status
}

export enum Status {
    LOADING= 'loading',
    SUCCESS= 'success',
    ERROR= 'error',
}

const initialState : PizzaSliceSate = {
    items: [],
    status: Status.LOADING
}

export const fetchPizzas = createAsyncThunk<Pizza[],Record<string, string> >(
    'pizza/fetchPizzasStatus',
    async (params) => {
        const {sortBy, order, category, search, currentPage} = params;
        const {data} = await axios.get<Pizza[]>(
            `https://62a97197ec36bf40bdb79673.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
        )
        return data
    }
)

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<Pizza[]>) {
            state.items = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPizzas.pending, (state, action)=>{
            state.status = Status.LOADING
            state.items = []
        })
        builder.addCase(fetchPizzas.fulfilled, (state, action)=>{
            state.status = Status.SUCCESS
            state.items = []
        })
        builder.addCase(fetchPizzas.rejected, (state, action)=>{
            state.status = Status.ERROR
            state.items = []
        })
    }
})

export const selectPizzaData = (state: RootState) => state.pizza

export const {setItems} = pizzaSlice.actions;

export default pizzaSlice.reducer;