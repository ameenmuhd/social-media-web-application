import {configureStore} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import {combineReducers} from 'redux'
import storage from 'redux-persist/lib/storage'
import UserReducer from './Slices/User'

const persistConfig = { key: "root" , storage }

const reducer = combineReducers({
    user:UserReducer,
});

const persisteReducer = persistReducer(persistConfig, reducer)

const store= configureStore({
    reducer:persisteReducer
})

export default store ;