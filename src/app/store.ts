import { configureStore } from '@reduxjs/toolkit'

import loginSlice from '../features/loginSlice'
import itemsSlice from '../features/itemsSlice'

export const store =  configureStore({
  reducer: {
    login: loginSlice,
    items: itemsSlice
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
