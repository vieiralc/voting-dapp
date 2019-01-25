const assert = require("assert");
const Voting = artifacts.require('./Voting.sol');

contract('Voting', accounts => {
  let voting;
  let owner = accounts[0];

  beforeEach('setup contract for each test', async () => {
    voting = await Voting.new(owner);
  });

  it('Starts with the correct value', async() => {
    let proposalId = await voting.proposalId();
    assert.equal(proposalId, 0, "proposalId should start at 0");
  });

  it('Starts with zero proposals', async() => {
    let proposals = await voting.getAllProposals();
		assert(proposals, [], "shoul be an empty array");
  });

  it('Creates a new proposal', async() => {
    let proposer;
    let proposalName = "arrays should start at 0?";
    let proposalDesc = "Some people think they should start at 1"
    await voting.newProposal(proposalName, proposalName, { from: proposer})
      .then()  
      ;
    
  })

});