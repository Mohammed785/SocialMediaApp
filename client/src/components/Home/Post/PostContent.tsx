import PostModal from "./PostModal"
function PostContent({id,images,body}:{id:number,images:Record<string,any>[],body:string}){
    return <>
        <div>
            <p>
                {body}
            </p>
            <div className="post-images pointer" data-bs-toggle="modal" data-bs-target={`#post${id}modal`}>
                {images.length === 1 &&
                    <img src={images[0].image} className="img-fluid rounded" />
                }
                {images.length === 2 &&
                    <div className="d-flex">{
                        images.map((image: Record<string, any>) => {
                            return <img key={image.id} src={image.image} style={{ width: "50%", margin: "0 2px", height: "auto" }} />
                        })
                    }
                    </div>
                }
                {images.length >= 3 &&
                    <div className="grid">
                        {
                            images.map((image: Record<string, any>, idx: number) => {
                                if (idx <= 2) {
                                    return <div key={image.id} className={`card span-${idx === 0 ? 3 : 2}`} style={{ backgroundImage: `url(${image.image})` }}></div>

                                }
                            })
                        }
                    </div>
                }
            </div>
        </div>
        <PostModal {...{ id, images }} />
    </>
}

export default PostContent