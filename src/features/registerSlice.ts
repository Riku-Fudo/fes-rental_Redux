import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'


type formvlaue = {
    userName: string
    zipcode: string
    prefectures: string
    city: string
    houseNumber: string
    buildingName: string
    familyName: string
    firstName: string
    familyNameKana: string
    firstNameKana: string
    phoneNumber: string
    mailAddress: string
    password: string
    passwordTest: string
}

export const registerSlice = createSlice({
    name: 'register',
    initialState: {
        formValues: {
            userName: '',
            zipcode: '',
            prefectures: '',
            city: '',
            houseNumber: '',
            buildingName: '',
            familyName: '',
            firstName: '',
            familyNameKana: '',
            firstNameKana: '',
            phoneNumber: '',
            mailAddress: '',
            password: '',
            passwordTest: '',
        }
    },
    reducers: {
        setFormValues: (state, action: PayloadAction<formvlaue>) => {
            state.formValues = action.payload
        },
        // setUserName: (state, action: PayloadAction<string>) => {
        //     state.formValues.userName = action.payload
        // },
        // setZipcode: (state, action: PayloadAction<string>) => {
        //     state.formValues.zipcode = action.payload
        // },
        // setPrefectures: (state, action: PayloadAction<string>) => {
        //     state.formValues.prefectures = action.payload
        // },
        // setCity: (state, action: PayloadAction<string>) => {
        //     state.formValues.city = action.payload
        // },
        // setHouseNumber: (state, action: PayloadAction<string>) => {
        //     state.formValues.houseNumber = action.payload
        // },
        // setBuildingName: (state, action: PayloadAction<string>) => {
        //     state.formValues.buildingName = action.payload
        // },
        // setFamilyName: (state, action: PayloadAction<string>) => {
        //     state.formValues.familyName = action.payload
        // },
        // setFirstName: (state, action: PayloadAction<string>) => {
        //     state.formValues.firstName = action.payload
        // },
        // setFamilyNameKana: (state, action: PayloadAction<string>) => {
        //     state.formValues.familyNameKana = action.payload
        // },
        // setFirstNameKana: (state, action: PayloadAction<string>) => {
        //     state.formValues.firstNameKana = action.payload
        // },
        // setPhoneNumber: (state, action: PayloadAction<string>) => {
        //     state.formValues.phoneNumber = action.payload
        // },
        // setMailAddress: (state, action: PayloadAction<string>) => {
        //     state.formValues.mailAddress = action.payload
        // },
        // setPassword: (state, action: PayloadAction<string>) => {
        //     state.formValues.password = action.payload
        // },
        // setPasswordTest: (state, action: PayloadAction<string>) => {
        //     state.formValues.passwordTest = action.payload
        // },
    }
})

export const {
    setFormValues
} = registerSlice.actions

// export const {
//     setUserName,
//     setZipcode,
//     setPrefectures,
//     setCity,
//     setHouseNumber,
//     setBuildingName,
//     setFamilyName,
//     setFirstName,
//     setFamilyNameKana,
//     setFirstNameKana,
//     setPhoneNumber,
//     setMailAddress,
//     setPassword,
//     setPasswordTest
//  } = registerSlice.actions
export const selectRegister = (state: RootState) => state.register

export default registerSlice.reducer
