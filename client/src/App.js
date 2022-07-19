import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import {BrowserRouter,Route, Routes, useNavigate} from 'react-router-dom';
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
    <Route exact path='/' element={user ? <Home /> : <Login/>}></Route>
    <Route path='/login' element={!user ? <Login /> : <Home/>}></Route>
    <Route exact path='/profile' element={<Profile />}></Route>
    <Route path='/signup' element={!user ? <Signup /> : <Home/>}></Route>
    <Route path='/createpost' element={<CreatePost />}></Route>
    <Route path='/profile/:userId' element={<UserProfile />}></Route>
    <Route path='/following' element={<FollowingUsersPost />}></Route>
    <Route path='/editpost/:postId' element={<EditPost />}></Route>
    <Route path='/edituser/:userId' element={<UserEdit />}></Route>
    </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    <BottomNavbar/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
