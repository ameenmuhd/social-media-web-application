import {createSlice} from '@reduxjs/toolkit';

export const UserDataSlice = createSlice({
    name: "user",
    initialState: {
        value: {}
    },
    reducers: {
        signIn: (state1,action)=>{
            state1.value = action.payload
        }
    }
})

export const {signIn} = UserDataSlice.actions;
export default UserDataSlice.reducer;