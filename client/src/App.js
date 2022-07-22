import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import {BrowserRouter,Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile';
import FollowingUsersPost from './components/screens/FollowingUsersPost';
import EditPost from './components/screens/EditPost';
import UserEdit from './components/screens/UserEdit/UserEdit';
import BottomNavbar from './components/BottomNavbar/BottomNavbar';
import Chat from './components/screens/Chat';
import MarketPlace from './components/screens/MarketPlace';

export const UserContext = createContext()

const Routing = ()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
  },[])
  const user = JSON.parse(sessionStorage.getItem("user"))
  return(
    <Routes>
    {/* <Route element={<Navbar/>} > </Route> */}
    <Route exact path='/' element={<Home />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route exact path='/profile' element={<Profile />}></Route>
    <Route path='/signup' element={<Signup />}></Route>
    <Route path='/createpost' element={<CreatePost />}></Route>
    <Route path='/profile/:userId' element={<UserProfile />}></Route>
    <Route path='/following' element={<FollowingUsersPost />}></Route>
    <Route path='/editpost/:postId' element={<EditPost />}></Route>
    <Route path='/edituser/:userId' element={<UserEdit />}></Route>
    <Route path='/chat/:userId' element={<Chat />}></Route>
    <Route path='/marketplace' element={<MarketPlace />}></Route>
    </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  
     
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Routing/>
    {/* <BottomNavbar/> */}
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
