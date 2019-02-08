import React, { Component } from 'react';
import Card from './Card';
import Spinner from '../common/Spinner';

import "../css/landing.css";

class Landing extends Component {

  constructor() {

    super();
    this.state = {
      proposals: []
    }
  };

  componentDidMount() {
    
    const { contract, accounts } = this.props;
    this.loadProposals(contract, accounts);
  };

  loadProposals = async (contract, accounts) => {

    const proposalsIds = await contract.methods.getAllProposals().call({
      from: accounts[0]
    })

    try{
      proposalsIds.forEach(async id => {
        let proposal = await contract.methods.getProposal(parseInt(id)).call({
          from: accounts[0]
        });
        
        let proposalObj = {}
        proposalObj.id = id;
        proposalObj.name = proposal[0];
        proposalObj.description = proposal[1];
        proposalObj.positiveVotes = proposal[2];
        proposalObj.negativeVotes = proposal[3];
        proposalObj.voters = proposal[4];
        proposalObj.owner = proposal[5]
        
        this.setState({ proposals: [proposalObj, ...this.state.proposals] });      
      })
    } catch(err) {
			console.log('Landing -> catch -> err', err)
    }
  }

  render() {

    if (this.state.proposals.length === 0) {
      return <Spinner/>
    }

    return (
      <div className="container-fluid land-container">
          
        <div className="row justify-content-center">
          <div className="col-md-5">
            {
              this.state.proposals.map((proposal, index) => 
                <Card key={index} proposal={proposal} contract={this.props.contract}/>
              )
            }
          </div>
        </div>

        <div className="newProposal">
          <i className="fas fa-plus my-float"></i>
        </div>
      </div>
    );    
  };
};

export default Landing;