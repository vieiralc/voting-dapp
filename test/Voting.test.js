const assert = require("assert");
const Voting = artifacts.require('./Voting.sol');

contract('Voting', accounts => {
  let voting;
  let owner = accounts[0];
  let voter1 = accounts[1];
  let voter2 = accounts[2];
  let voter3 = accounts[3];

  // will be used to create and get a proposal
  let proposer = accounts[1];
  let proposalName = "arrays should start at 0?";
  let proposalDesc = "Some people think they should start at 1";
  let proposalId = 0;

  before('setup contract for each test', async () => {
    voting = await Voting.new(owner);
  });

  it('Starts with the correct value', async() => {
    let proposalId = await voting.proposalId();
    assert.equal(proposalId, 0, "proposalId should start at 0");
  });

  it('Starts with zero proposals', async() => {
    let proposals = await voting.getAllProposals();
		assert(proposals, [], "should be an empty array");
  });

  it('Creates a new proposal', async() => {
    await voting.newProposal(proposalName, proposalDesc, { from: proposer})
      .then(receipt => {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'NewProposal', 'should be the NewProposal event');
        assert.equal(receipt.logs[0].args.name, proposalName, 'logs the proposal name');
        assert.equal(receipt.logs[0].args.proposer, proposer, 'logs the proposer of the proposal');
      });
  });

  it('Gets a proposal', async() => {
    let proposal = await voting.getProposal(proposalId);
    assert.equal(proposal[0], proposalName, "should have the same name");
    assert.equal(proposal[1], proposalDesc, "should have the same desc");
    assert.equal(proposal[2], 0, "should have 0 positive votes");
    assert.equal(proposal[3], 0, "should have 0 negative votes");
    assert.equal(proposal[4].length, 0, "should return an empty array");
    assert.equal(proposal[5], proposer, "should return the proposer address");
  });

  it('Votes positive for a proposal', async() => {
    await voting.votePositive(proposalId, {from: voter1})
      .then(receipt => {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Voted', 'should be the Voted event');
        assert.equal(receipt.logs[0].args.proposalName, proposalName, 'should have the same name');
        assert.equal(receipt.logs[0].args.voter, voter1, 'should return the voter address');
        assert.equal(receipt.logs[0].args.positiveVotes, 1, 'should have 1 positive vote');
        assert.equal(receipt.logs[0].args.negativeVotes, 0, 'should have 0 negative votes');
      })
  });

  it('votes negative for a proposal', async() => {
    await voting.voteNegative(proposalId, {from: voter2})
      .then(receipt => {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Voted', 'should be the Voted event');
        assert.equal(receipt.logs[0].args.proposalName, proposalName, 'should have the same name');
        assert.equal(receipt.logs[0].args.voter, voter2, 'should return the voter address');
        assert.equal(receipt.logs[0].args.positiveVotes, 1, 'should have 1 positive vote');
        assert.equal(receipt.logs[0].args.negativeVotes, 1, 'should have 1 negative votes');
      })
  });

  it('Check already voted', async() => {
    await voting.votePositive(proposalId, {from: voter1})
      .then(assert.fail)
      .catch(error =>
        assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
      );
  });

});