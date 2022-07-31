import { IUser } from "../../@types/auth"
import { useAuthContext } from "../../context/authContext"
import ChangePassword from "./ChangePassword"
import ChangeProfilePics from "./ChangeProfilePics"
import UpdateInfo from "./UpdateInfo"


function About({info,owner}:{info:IUser,owner:boolean}){
    return <>
        <div className="bg-dark about-section row">
            <div className="col-lg-5">
                <div className="d-flex justify-content-center mb-2">
                    {
                        owner&&<>
                            <UpdateInfo id={info!.id}/>
                            <ChangePassword/>
                            <ChangeProfilePics type="profile"/>
                            <ChangeProfilePics type="cover" />
                        </>
                    }
                </div>
                <div className="card mb-4 bg-gray-dark" style={{ borderRadius: "0.55rem"}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Full Name</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="mb-0">{info.firstName} {info.lastName}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Email</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="mb-0">{info.email}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Birth Date</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="mb-0">{new Date(info.birthDate||0).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Gender</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="mb-0">{info.gender?"Male":"Female"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default About