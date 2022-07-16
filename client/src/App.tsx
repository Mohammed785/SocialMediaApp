import {BrowserRouter,Route,Routes} from "react-router-dom"
import Navbar from "./components/Navbar/Navbar";
import ForgetPassword from "./pages/ForgetPassword";
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from "./pages/ResetPassword";


function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path="/forgetPassword" element={<ForgetPassword/>}/>
    <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
  </Routes>
    <Navbar/>
  </BrowserRouter>
}

export default App;
