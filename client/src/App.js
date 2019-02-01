import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./utils/getWeb3";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import "./App.css";
import WrongNetwork from "./not-found/WrongNetwork";
import Navbar from "./layout/Navbar";
import Landing from "./layout/Landing";
import Footer from "./layout/Footer";

class App extends Component {
  state = { proposals: [], web3: null, accounts: null, contract: null, correctNetwork: true };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // add a check for network ID before continue
      console.log('​App -> componentDidMount -> networkId', networkId);
      if (networkId === 5777) {
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance }, this.runExample);
      } else {
        this.setState({ correctNetwork: false })
      }
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    const proposals = await contract.methods.getAllProposals().call({ from: accounts[0] });
    console.log(proposals)
    // Update state with the result.
    this.setState({ proposals: proposals });
  };

  render() {
    if (!this.state.correctNetwork) {
      return <WrongNetwork/>;
    }
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Router>
        <div className='container-fluid'>
          <Navbar/>
          <Route exact path="/" component={Landing}/>
            <div>The stored value is: {this.state.storageValue}</div>
          <Footer/>
        </div>
      </Router>
    );
  }
}

export default App;
