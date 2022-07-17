import { UIEvent, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom";
import axiosClient from "../../axiosClient";
function SearchForm() {
    const [searchInfo,setSearchInfo] = useState({search:"",cursor:0,timeout:0,result:[]})
    const searchMsgRef = useRef<HTMLParagraphElement>(null)
    const searchResRef = useRef<HTMLDivElement>(null)
    const loadMoreRef = useRef<HTMLButtonElement>(null)
    async function userSearch(){
        try{
            const response = await axiosClient.get(`/user/all/?search=${searchInfo.search}&cursor=${searchInfo.cursor}`)
            setSearchInfo({ ...searchInfo, cursor: response.data.cursor, result: searchInfo.result.concat(response.data.users) })
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        if(searchInfo.search.length>=4){
            searchMsgRef.current!.classList.add("d-none")
            userSearch()
        }else{
            searchMsgRef.current!.classList.remove("d-none")
        }
    },[searchInfo.search])
    function handleSearchScroll(e: UIEvent) {
        if (searchInfo.cursor===0) {
            loadMoreRef.current?.classList.remove("d-none")
        }else{
            loadMoreRef.current?.classList.add("d-none")
        }
    }
    return (
        <>
            <div className="col d-flex align-items-center">
                <i className="fab fa-facebook text-primary" style={{ fontSize: "3rem" }}></i>
                <div className="input-group ms-2" typeof="button">
                    <span className="input-group-prepend" id="searchMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        <div className="input-group-text bg-gray border-0 rounded-circle" style={{ minHeight: "40px" }}>
                            <FaSearch className="text-muted" />
                        </div>
                    </span>
                    <div onScroll={handleSearchScroll} className="dropdown-menu overflow-auto border-0 shadow p-3" style={{ width: "20em", maxHeight: "600px" }} aria-labelledby="searchMenu" data-popper-placement="bottom-start">
                        <div>
                            <input type="text" value={searchInfo.search} onChange={(e)=>setSearchInfo({...searchInfo,search:e.target.value})} style={{margin:"0px"}} className="rounded-pill border-0 bg-gray dropdown-item" name="search" id="search" placeholder="Search..." />
                            <hr style={{ margin: "10px 0px" }} />
                        </div>
                        <div ref={searchResRef}>
                            <p ref={searchMsgRef} className="text-muted text-center">Write {4 - searchInfo.search.length} more letter to start search</p>
                            {searchInfo.result && 
                                searchInfo.result.map((user:{id:number,firstName:string,lastName:string})=>{
                                    return <div className="my-4" key={user.id}>
                                        <div className=" alert fade show dropdown-item p-1 m-0 d-flex align-items-center justify-content-between" role="alert">
                                            <Link className="d-flex align-items-center" to={"/profile/" + user.id}>
                                                <img src="./img.jpg" alt="avatar" className="rounded-circle me-2" style={{ width: "35px", height: "35px", objectFit: "cover" }} />
                                                <p className="m-0" style={{color:"black"}}>{user.firstName+user.lastName}</p>
                                            </Link>
                                            <button type="button" className="btn-close p-0 m-0" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                            {searchInfo.result && 
                            <button onClick={userSearch} ref={loadMoreRef} className="btn btn-success">Load More</button>
                            }
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchForm;