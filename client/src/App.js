import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./utils/getWeb3";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import WrongNetwork from "./not-found/WrongNetwork";
import Navbar from "./layout/Navbar";
import Landing from "./layout/Landing";
import Spinner from "./common/Spinner";

class App extends Component {
  state = { proposals: [], web3: null, accounts: null, contract: null, correctNetwork: true };

  componentWillMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];
      
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];

      // Get the contract instance.
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      if (networkId === 3) {
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance });
      } else {
        this.setState({ correctNetwork: false })
      }
      
    } catch (error) {
      alert(`Please, install metamask in order to use this dapp.`,);
      console.error(error);
    }
  };

  render() {
    
    if (!this.state.correctNetwork) {
      return <WrongNetwork/>;
    }

    if (!this.state.web3) {
      return <Spinner/>;
    }
    
    return (
      <Router>
        <div>
          <Navbar/>
          <Route exact path="/" render={() => <Landing contract={this.state.contract} accounts={this.state.accounts}/>}/>
        </div>
      </Router>
    );
  }
}

export default App;
