export const SpinnerLoader = ()=>{

    return(
        <div className="m-5 d-flex justify-content-center container" style={{height:550}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>
        </div>
    )
}