import { Link } from "react-router-dom";

function NotFoundPage(){
    return <>
        <div className="d-flex bg-dark align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 text-danger fw-bold">404</h1>
                <p className="fs-3 text-white"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead text-white">
                    The page you’re looking for doesn’t exist.
                </p>
                <Link to="/" className="btn btn-outline-success">Go Home</Link>
            </div>
        </div>
    </>
}

export default NotFoundPage