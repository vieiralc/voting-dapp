import React, { Component } from 'react';
import $ from 'jquery';
import '../css/card.css';

class Card extends Component {
  
    constructor() {
        super();

        this.state = {
            bookmark: false,
            bookmarks: [],
            votepositive: false,
            votenagative: false
        };

        this.bookmarkProposal = this.bookmarkProposal.bind(this);
        this.votePositive = this.votePositive.bind(this);
        this.voteNegative = this.voteNegative.bind(this);
    };

    componentDidMount() {
        this.props.contract.events.Voted({fromBlock: 'latest'})
            .on('data', event => {
				$(`#positive${event.returnValues[0]}`).html(event.returnValues[2]);
                $(`#negative${event.returnValues[0]}`).html(event.returnValues[3]);
            });
    }

    bookmarkProposal(id) {

        this.setState({
            bookmark: !this.state.bookmark, 
            bookmarks: [...this.state.bookmarks, id]
        });

        console.log(this.state.bookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
    };

    votePositive() {
        if (!this.state.votenagative && !this.state.votepositive) {
            this.setState({votepositive: !this.state.votepositive});
        }
    };

    voteNegative() {
        if (!this.state.votepositive && !this.state.votenagative) {
            this.setState({votenagative: !this.state.votenagative});
        }
    };

    render() {

        const { proposal } = this.props;
        let bookmarkclass = this.state.bookmark ? 'bookmarked' : 'unmarked';
        let votepositiveclass = this.state.votepositive ? 'positiveVotes' : 'not-voted';
        let votenegativeclass = this.state.votenagative ? 'negativeVotes' : 'not-voted';

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
                                <i className={`fas fa-bookmark ${bookmarkclass}`} onClick={() => this.bookmarkProposal(proposal.id)}></i>
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
                            <i className={`fas fa-thumbs-up ${votepositiveclass}`} onClick={this.votePositive}> </i>
                        </div>  

                        <div className="col-md-4 col-sm-4 col-4 text-center">
                            2 days ago
                        </div>

                        <div className="col-md-4 col-sm-4 col-4 text-right">
                            <span id={`negative${proposal.id}`} className="badge badge-danger"> {proposal.negativeVotes} </span> &nbsp;
                            <i className={`fas fa-thumbs-down ${votenegativeclass}`} onClick={this.voteNegative}> </i>
                        </div>
                    </div>
                    
                </div>

            </div>
        );
    };
};

export default Card;