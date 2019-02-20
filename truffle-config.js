require('dotenv').config();
const HDwalletProvider = require('truffle-hdwallet-provider');
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    
    development: {
      host: "localhost",
      port: "9545",
      network_id: "*"
    },
    
    ropsten: {
      provider: function() {
        return new HDwalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.infuraKey}`
        );
      },
      gasPrice: 25000000000,
      network_id: 3
    },
    
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};