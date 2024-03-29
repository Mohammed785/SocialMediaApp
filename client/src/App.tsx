import {BrowserRouter,Outlet,Route,Routes} from "react-router-dom"
import Navbar from "./components/Navbar/Navbar";
import ForgetPassword from "./pages/ForgetPassword";
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home"
import SavedPosts from "./pages/SavedPosts";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import RequireAuth from "./components/Auth/RequireAuth";
import { Toaster } from "react-hot-toast";
import { AxiosError } from "./axiosClient";
import NotFoundPage from "./pages/NotFound";
import Chat from "./pages/Chat";

function WithNav(){
  return <>
  <div className="bg-dark container-fluid">
    <AxiosError/>
      <div><Toaster position="bottom-right" toastOptions={{ success: { className:"text-white", style: { backgroundColor:"#03632d"}}}} reverseOrder={false}/></div>
      <Navbar/>
      <div className="row justify-content-evenly">
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
      <Route element={<RequireAuth><WithNav/></RequireAuth>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/profile/:id" element={<Profile/>}/>
      <Route path="/groups" element={<Groups/>}/>
      <Route path="/group/:id" element={<Group/>}/>
      <Route path="/posts/saved" element={<SavedPosts/>}/>
      <Route path="/chat" element={<Chat/>}/>
    </Route>
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>
  </BrowserRouter>
}

export default App;
