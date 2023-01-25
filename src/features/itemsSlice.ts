import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RentalHistory } from 'types/user';
import type { RootState } from '../app/store'

export const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        price: 0,
        period: 0,
        isChoiced: false,
        start: false,
        startId:0,
        rental: <RentalHistory[]>([])
    },
    reducers: {
        setPrice: (state, action: PayloadAction<number>) => {
            state.price = action.payload
        },
        setPeriod: (state, action: PayloadAction<number>) => {
            state.period = action.payload
        },
        setIsChoiced: (state, action: PayloadAction<boolean>) => {
            state.isChoiced = action.payload
        },
        setStart: (state, action: PayloadAction<boolean>) => {
            state.start = action.payload
        },
        setStartId: (state, action: PayloadAction<number>) => {
            state.startId = action.payload
        },
        setRental: (state, action: PayloadAction<RentalHistory[]>) => {
            state.rental = action.payload
        },
    }
})

export const { setPrice, setPeriod, setIsChoiced, setStart, setStartId, setRental } = itemsSlice.actions
export const selectItems = (state: RootState) => state.items

export default itemsSlice.reducer
