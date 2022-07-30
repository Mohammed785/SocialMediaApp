import { IUser } from "../../@types/auth"

function About({info}:{info:IUser}){   
    return <>
        <div className="about-section row">
            <div className="col-lg-5">
                <div className="card mb-4" style={{ borderRadius: "0.55rem", backgroundColor: "#eee" }}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Full Name</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{info.firstName} {info.lastName}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Email</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{info.email}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Birth Date</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{new Date(info.birthDate||0).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Gender</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{info.gender?"Male":"Female"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default About