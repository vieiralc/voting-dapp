import React from 'react'

export default () => {
  
    return (
      
        <div className="card text-white bg-dark mb-3">
        
            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        Proposed by: <span className="text-uppercase"> 
                        <a href="https://ropsten.etherscan.io/address/0x9c7235749bed9a272133b4ba660bd29a09d63506"> 
                            0x6273 
                        </a> </span>
                    </div>
                    <div className="col-md-6">
                        <div className="text-right">
                            Save
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <h5 className="card-title"> Proposal Title</h5>
                <p className="card-text">
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                </p><br/>
                <button type="button" className="btn btn-light">
                    Like <span className="badge badge-success">4</span>
                </button> &nbsp;
                <button type="button" className="btn btn-light">
                    Dislike <span className="badge badge-danger">1</span>
                </button>
            </div>

            <div className="card-footer text-muted text-center">
                2 days ago
            </div>
        </div>
      
    );
}