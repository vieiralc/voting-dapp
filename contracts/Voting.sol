pragma solidity ^0.5.0;

contract Voting {
    
    event Voted(uint proposalId, address voter, uint positiveVotes, uint negativeVotes);
    event NewProposal(
        uint proposalId, 
        string proposalName, 
        string proposalDesc, 
        uint positiveVotes, 
        uint negativeVotes, 
        address[] voters, 
        address proposer
    );
    event newProposalSaved(uint proposalId);
    event removeFromSaved(uint proposalId);
    
    mapping (uint => Proposal) proposalObj;
    mapping (address => User) userObj;
    uint public proposalId = 1;
    uint[] proposals;

    struct User {
        uint[] saved;
        uint[] myProposals;
    }
    
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
        userObj[msg.sender].myProposals.push(proposalId);
        proposalId++;
        emit NewProposal(
            proposalId-1,
            _name,
            _desc,
            0,
            0,
            prop.voters,
            prop.proposer
        );
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
            _proposalId, 
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
            _proposalId, 
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

    function checkAlreadySaved(uint _proposalId) internal view returns(bool alreadySaved, uint index) {
        uint[] memory proposalsIds = userObj[msg.sender].saved;
        uint i = 0;
        
        for (i = 0; i < proposalsIds.length; i++) {
            if (proposalsIds[i] == _proposalId)
                return (true, i);
        }

        return (false, i);
    }

    function saveProposal(uint _proposalId) public {
        
        bool alreadySaved;
        uint index;
        uint[] memory array = userObj[msg.sender].saved;
        (alreadySaved, index) = checkAlreadySaved(_proposalId); 
        
        if (alreadySaved) {
            delete array[index];   
            removeGap(index, array);
            emit removeFromSaved(_proposalId);
        } else {
            userObj[msg.sender].saved.push(_proposalId);
            emit newProposalSaved(_proposalId);
        }
    }

    function removeGap(uint index, uint[] memory array) internal pure {
        if (index > array.length) return;

        for (uint i = index; i < array.length - 1; i++)
            array[i] = array[i+1];
        
        delete array[array.length-1];
    }

    function getSaved() public view returns (uint[] memory) {
        return userObj[msg.sender].saved;
    }

    function getMyProposals() public view returns (uint[] memory) {
        return userObj[msg.sender].myProposals;
    }
}