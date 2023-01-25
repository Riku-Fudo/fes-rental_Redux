import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

export const mypageSlice = createSlice({
    name: 'items',
    initialState: {
        start: false,
        startId:0,
    },
    reducers: {
        setStart: (state, action: PayloadAction<boolean>) => {
            state.start = action.payload
        },
        setStartId: (state, action: PayloadAction<number>) => {
            state.startId = action.payload
        },
    }
})

export const { setStart, setStartId } = mypageSlice.actions
export const selectMypage = (state: RootState) => state.items

export default mypageSlice.reducer
