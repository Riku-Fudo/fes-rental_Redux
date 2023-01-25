import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        mailAddress: '',
        password: ''
    },
    reducers: {
        setMailAddress: (state, action: PayloadAction<string>) => {
            state.mailAddress = action.payload
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
    }
})

export const { setMailAddress, setPassword } = loginSlice.actions
export const selectLogin = (state: RootState) => state.login

export default loginSlice.reducer
