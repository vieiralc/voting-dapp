const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const json = require("../client/src/contracts/Voting.json");
const interface = json['abi'];
const bytecode = json['bytecode'];

let accounts;
let manager;
let voting;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];

  voting = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode})
    .send({ from: manager, gas: '1000000'});
});

describe('Voting', () => {
  
  it('deploys a contract', async() => {
    const proposalId = await voting.proposalId;
    assert.equal(proposalId, 0, "The proposalId should start at 0.");
  });
});