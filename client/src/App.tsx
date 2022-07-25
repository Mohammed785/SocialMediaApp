import {BrowserRouter,Outlet,Route,Routes} from "react-router-dom"
import Navbar from "./components/Navbar/Navbar";
import ForgetPassword from "./pages/ForgetPassword";
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home"
import SavedPosts from "./pages/SavedPosts";
import Profile from "./pages/Profile";

function WithNav(){
  return <>
  <div className="container-fluid">
      <div className="row justify-content-evenly">
        <Navbar/>
        <Outlet/>
      </div>
  </div>
  </>
}

function App() {
  return <BrowserRouter>
  <Routes>
    <Route element={<Outlet/>}>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/forgetPassword" element={<ForgetPassword/>}/>
      <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
    </Route>
    <Route element={<WithNav/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/profile/:id" element={<Profile/>}/>
      <Route path="/posts/saved" element={<SavedPosts/>}/>
    </Route>
  </Routes>
  </BrowserRouter>
}

export default App;
