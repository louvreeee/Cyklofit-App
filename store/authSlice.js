import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        userData: null,
        didTryAutoLogin: false,
    },
    reducers: {
        authenticate: (state, action) => {
            const { payload } = action
            //state.token = payload.token
            state.userData = payload.userData
            state.didTryAutoLogin = true
            console.log(state)
        },
       
    },
})

export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin
export const authenticate = authSlice.actions.authenticate
export default authSlice.reducer