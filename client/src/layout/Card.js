import React, { Component } from 'react';
import $ from 'jquery';
import '../css/card.css';

class Card extends Component {
  
    constructor() {
        super();

        this.state = {
            bookmark: false
        };
    };

    componentDidMount() {
        this.props.contract.events.Voted({fromBlock: 'latest'})
            .on('data', event => {
                console.log(event.returnValues[2]);
				$(`#positive0`).html(event.returnValues[2]);
                $(`#negative0`).html(event.returnValues[3]);
            });
    }

    bookmarkProposal() {
      this.setState({bookmark: !this.state.bookmark})  
    };

    render() {

        const { proposal } = this.props;
        let bookmarkclass = this.state.bookmark ? 'bookmarked' : 'unmarked';

        return (
            <div className="card text-white bg-dark mb-3">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-9 col-sm-9 col-9">
                            Proposed by: <span className="text-uppercase"> 
                            <a href={`https://ropsten.etherscan.io/address/${proposal.owner}`} target="_blank" rel="noopener noreferrer"> 
                                {proposal.owner.substring(0,8)} 
                            </a> </span>
                        </div>
                        <div className="col-md-3 col-sm-3 col-3">
                            <div className="text-right">
                                <i className={`fas fa-bookmark ${bookmarkclass}`} onClick={this.bookmarkProposal.bind(this)}></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <h5 className="card-title"> {proposal.name.toUpperCase()} </h5>
                    <p className="card-text">
                        {proposal.description}
                    </p>
                </div>

                <div className="card-footer">
                    <div className="row">
                        <div className="col-md-4 col-sm-4 col-4 text-left">
                            <span id={`positive${proposal.id}`} className="badge badge-success"> {proposal.positiveVotes} </span> &nbsp;
                            <i className="fas fa-thumbs-up"> </i>
                        </div>  

                        <div className="col-md-4 col-sm-4 col-4 text-center">
                            2 days ago
                        </div>

                        <div className="col-md-4 col-sm-4 col-4 text-right">
                            <span id={`negative${proposal.id}`} className="badge badge-danger"> {proposal.negativeVotes} </span> &nbsp;
                            <i className="fas fa-thumbs-down"> </i>
                        </div>
                    </div>
                    
                </div>

            </div>
        );
    };
};

export default Card;