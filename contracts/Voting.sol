pragma solidity ^0.5.0;

contract Voting {
    
    event Voted(string proposalName, address voter, uint positiveVotes, uint negativeVotes);
    event NewProposal(string name, address proposer);
    
    mapping (uint => Proposal) proposalObj;
    uint public proposalId = 0;
    uint[] proposals;
    
    struct Proposal {
        string name;
        string desc;
        uint positiveVotes;
        uint negativeVotes;
        address[] voters;
        address proposer;
    }
    
    function newProposal(string memory _name, string memory _desc) public {
        
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_desc).length > 0, "Description cannot be empty");
        
        Proposal storage prop = proposalObj[proposalId];
        prop.name = _name;
        prop.desc = _desc;
        prop.positiveVotes = 0;
        prop.negativeVotes = 0;
        prop.proposer = msg.sender;
        proposals.push(proposalId);
        proposalId++;
        emit NewProposal(_name, msg.sender);
    }
    
    function getProposal(uint _proposalId) public view
        returns(
            string memory, 
            string memory, 
            uint, 
            uint, 
            address[] memory, 
            address
        ) {
 
            return (
                proposalObj[_proposalId].name,
                proposalObj[_proposalId].desc,
                proposalObj[_proposalId].positiveVotes,
                proposalObj[_proposalId].negativeVotes,
                proposalObj[_proposalId].voters,
                proposalObj[_proposalId].proposer
            );
    }
    
    function getAllProposals() public view returns(uint[] memory) {
        return proposals;
    }
    
    function votePositive(uint _proposalId) public {
        
        require(!checkAlreadyVoted(msg.sender, _proposalId), "User already voted for this proposal");
        
        proposalObj[_proposalId].positiveVotes++;
        proposalObj[_proposalId].voters.push(msg.sender);
        emit Voted(
            proposalObj[_proposalId].name, 
            msg.sender,
            proposalObj[_proposalId].positiveVotes,
            proposalObj[_proposalId].negativeVotes
        );
    }
    
    function voteNegative(uint _proposalId) public {
        
        require(!checkAlreadyVoted(msg.sender, _proposalId), "User already voted for this proposal");
        
        proposalObj[_proposalId].negativeVotes++;
        proposalObj[_proposalId].voters.push(msg.sender);
        emit Voted(
            proposalObj[_proposalId].name, 
            msg.sender,
            proposalObj[_proposalId].positiveVotes,
            proposalObj[_proposalId].negativeVotes
        );
    }
 
    function checkAlreadyVoted(address voterAddress, uint _proposalId) internal view returns(bool) {
 
        address[] memory voters = proposalObj[_proposalId].voters;
 
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i] == voterAddress)
                return true;
        }
 
        return false;
    }
}