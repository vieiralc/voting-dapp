const assert = require("assert");
const Voting = artifacts.require('./Voting.sol');

contract('Voting', accounts => {
  let voting;
  let owner = accounts[0];
  let voter1 = accounts[1];
  let voter2 = accounts[2];

  // will be used to create and get a proposal
  let proposer = accounts[1];
  let proposalName = "arrays should start at 0?";
  let proposalDesc = "Some people think they should start at 1";
  let proposalId = 1;

  before('setup contract for the test', async () => {
    voting = await Voting.new(owner);
  });

  it('Starts with the correct value', async() => {
    let proposalId = await voting.proposalId();
    assert.equal(proposalId, 1, "proposalIds should start at 1");
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
        assert.equal(receipt.logs[0].args.proposalId, proposalId, 'logs the proposal id');
        assert.equal(receipt.logs[0].args.proposalName, proposalName, 'logs the proposal name');
        assert.equal(receipt.logs[0].args.proposalDesc, proposalDesc, 'logs the proposal description');
        assert.equal(receipt.logs[0].args.positiveVotes, 0, 'positive votes should be zero');
        assert.equal(receipt.logs[0].args.negativeVotes, 0, 'negative votes should be zero');
        assert.equal(receipt.logs[0].args.voters.length, 0, 'voters should be empty');
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
        assert.equal(receipt.logs[0].args.proposalId, proposalId, 'should have the same id');
        assert.equal(receipt.logs[0].args.positiveVotes, 1, 'should have one positive vote');
        assert.equal(receipt.logs[0].args.negativeVotes, 0, 'should have zero negative votes');
      });
  });

  it('votes negative for a proposal', async() => {
    await voting.voteNegative(proposalId, {from: voter2})
      .then(receipt => {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Voted', 'should be the Voted event');
        assert.equal(receipt.logs[0].args.proposalId, proposalId, 'should have the same id');
        assert.equal(receipt.logs[0].args.positiveVotes, 1, 'should have one positive vote');
        assert.equal(receipt.logs[0].args.negativeVotes, 1, 'should have zero negative votes');
      });
  });

  it('gets a proposal voters', async() => {
    let proposal = await voting.getProposal(proposalId);
    let v1 = proposal[4][0];
    let v2 = proposal[4][1];
    assert.equal(voter1, v1, "should have the same address");
    assert.equal(voter2, v2, "should have the same address");
  })

  it('Checks already voted for votePositive', async() => {
    await voting.votePositive(proposalId, {from: voter1})
      .then(assert.fail)
      .catch(error =>
        assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
      );
  });

  it('Checks alreaedy voted for voteNegative', async() => {
    await voting.voteNegative(proposalId, {from: voter1})
      .then(assert.fail)
      .catch(error => 
        assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
      );
  });

  it('checks proposal name validation', async() => {
    await voting.newProposal("", "description", {from: proposer})
      .then(assert.fail)
      .catch(error =>
        assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
      );
  });

  it('check proposal description validation', async() => {
    await voting.newProposal("name", "", {from: proposer})
      .then(assert.fail)
      .catch(error => {
        assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
      });
    });

    it('saves a proposal', async() => {
      await voting.saveProposal(proposalId, {from: owner})
        .then(receipt => {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'newProposalSaved', 'should be the newProposalSaved event');
          assert.equal(receipt.logs[0].args.proposalId, proposalId, 'should have the same id');
        });
    });

    it('gets a saved proposal', async() => {
      let proposal = await voting.getSaved({ from: owner });
      assert.equal(proposal[0], proposalId, 'should return the id of the saved proposal');
    });

    it('gets owners proposals', async() => {
      let proposals = await voting.getMyProposals({ from: owner });
      assert.equal(proposals.length, 0, 'owner should not have any proposals');
    })

    it('gets proposer proposals', async() => {
      let proposals = await voting.getMyProposals({ from: proposer });
      assert.equal(proposals.length, 1, 'proposer should have 1 proposal');
      let proposalId = proposals[0];
			console.log('TCL: proposalId', proposalId)
      // let proposal = await voting.getProposal(proposals[0], { from: proposer })
      // assert.equal(proposal[0], proposalName, "should have the same name");
      // assert.equal(proposal[1], proposalDesc, "should have the same desc");
      // assert.equal(proposal[2], 1, "should have 1 positive votes");
      // assert.equal(proposal[3], 1, "should have 1 negative votes");
      // assert.equal(proposal[4].length, 2, "should've received 2 votes");
      // assert.equal(proposal[5], proposer, "should return the proposer address");
    })

});