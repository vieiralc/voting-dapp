import React, { Component } from 'react';
import Card from './Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import "../css/landing.css";

class Landing extends Component {

  constructor() {

    super();
    this.state = {
      proposals: [],
      show: false,
      proposalTitle: '',
      proposalDesc: ''
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  componentDidMount() {
    
    const { contract, accounts } = this.props;

    contract.events.NewProposal({fromBlock: 'latest'})
      .on('data', event => {
        let proposalObj = {}
        proposalObj.id = event.returnValues[0];
        proposalObj.name = event.returnValues[1];
        proposalObj.description = event.returnValues[2];
        proposalObj.positiveVotes = event.returnValues[3];
        proposalObj.negativeVotes = event.returnValues[4];
        proposalObj.voters = event.returnValues[5];
        proposalObj.owner = event.returnValues[6];
        this.setState({ proposals: [proposalObj, ...this.state.proposals] });
      });

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
			console.log('Landing -> LoadProposals -> catch -> err', err)
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    
    const { contract, accounts } = this.props;

    contract.methods.newProposal(this.state.proposalTitle, this.state.proposalDesc)
      .send({ from: accounts[0] })
      .then(receipt => {
        this.setState({ proposalTitle: '', proposalDesc: '' });
        this.handleClose();
      });
  }

  render() {

    return (
      <div className="container-fluid land-container">
          
        <div className="row justify-content-center">
          <div className="col-md-6">
            {
              this.state.proposals.length > 0 ?
                this.state.proposals.map((proposal, index) => 
                  <Card key={index} proposal={proposal} contract={this.props.contract} accounts={this.props.accounts}/>
                ) : <p className="text-center"> No proposals yet </p>
            }
          </div>
        </div>

        <div className="newProposal" onClick={this.handleShow}>
          <i className="fas fa-plus my-float"></i>
        </div>
       
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Make your proposal </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="title">Proposal Title: </label>
                <input 
                  name="proposalTitle"
                  value={this.state.proposalTitle}
                  onChange={this.onChange}
                  type="text" 
                  className="form-control" 
                  id="title" 
                  aria-describedby="proposalTitle" 
                  placeholder="Name your proposal"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description: </label>
                <textarea 
                  name="proposalDesc"
                  value={this.state.proposalDesc}
                  onChange={this.onChange}
                  placeholder="Describe whats on your mind" 
                  className="form-control" 
                  id="description" 
                  rows="3">
                </textarea>
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
            <Button variant="primary" onClick={this.onSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );    
  };
};

export default Landing;