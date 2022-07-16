import SearchForm from "./SearchForm"
import LinkIcon from "./LinkIcon"
import MenuIcon from "./MenuIcon"
import "./nav.css"
function Navbar(){
    return <>
    <div className="bg-white d-flex align-items-center fixed-top shadow" style={{minHeight: "56px", zIndex: "5"}}>
        <div className="container-fluid">
            <div className="row align-items-center">
                <SearchForm/>
                <LinkIcon/>
                <MenuIcon/>
            </div>
        </div>
    </div>
    </>
}

export default Navbar