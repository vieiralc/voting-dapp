import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

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
      return <div> Please connect to Ropsten Network </div>
    }
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
