import { IPostImage } from "../../../@types/post";

function PostModal({id,images}:{id:number,images:IPostImage[]}){

    return <>
        <div className="modal fade" id={`post${id}modal`} tabIndex={-1} data-bs-keyboard="false" data-bs-backdrop="static" aria-labelledby="" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content bg-dark">
                    <div className="modal-header">
                        <h3 className="text-white m-0">Post Images</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="carousel slide" id={`carousel${id}post-img`} data-bs-ride="false">
                            <div className="carousel-indicators">
                                {images.map((st, i) => {
                                    return <button key={i} type="button" data-bs-target={`#carousel${id}post-img`} data-bs-slide-to={i} className={i === 0 ? "active" : ""} aria-current="true" aria-label={`Slide ${i + 1}`}></button>
                                })}
                            </div>
                            <div className="carousel-inner">
                                {images.map((image, i) => {
                                    return <div key={image.id} className={i === 0 ? "carousel-item active" : "carousel-item"}>
                                        <img src={process.env.REACT_APP_STATIC_PATH+image.image} crossOrigin='anonymous' className="d-block w-100" alt="post image" />
                                        {image.description &&
                                            <div className={`carousel-caption d-none d-md-block`} style={{fontSize:"2em"}}>
                                                <p>{image.description}</p>
                                            </div>
                                        }
                                    </div>
                                })}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${id}post-img`} data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next"  type="button" data-bs-target={`#carousel${id}post-img`} data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default PostModal;