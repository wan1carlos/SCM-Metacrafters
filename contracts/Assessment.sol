// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    
    struct Project {
        string name;
        string description;
        uint256 voteCount;
    }
    
    Project[] public projects;
    mapping(address => bool) public hasVoted;

    event VoteCast(uint256 projectId, address voter);

    constructor() {
        owner = msg.sender;
        
        // Initialize with 3 default projects
        projects.push(Project("Eco-friendly Marketplace", "A sustainable marketplace for eco-friendly products", 0));
        projects.push(Project("DeFi Lending Platform", "Decentralized lending platform with competitive rates", 0));
        projects.push(Project("NFT Gaming Platform", "Gaming platform with NFT integration and rewards", 0));
    }

    function getTotalProjects() public view returns(uint256){
        return projects.length;
    }

    function castVote(uint256 _projectId) public {
        if (msg.sender != owner) {
            require(!hasVoted[msg.sender], "You have already voted");
        }
        require(_projectId < projects.length, "Invalid project ID");
        
        projects[_projectId].voteCount += 1;
        if (msg.sender != owner) {
            hasVoted[msg.sender] = true;
        }
        
        emit VoteCast(_projectId, msg.sender);
    }

    function getProjectVotes(uint256 _projectId) public view returns(uint256) {
        require(_projectId < projects.length, "Invalid project ID");
        return projects[_projectId].voteCount;
    }

    function getProjectDetails(uint256 _projectId) public view returns(string memory, string memory, uint256) {
        require(_projectId < projects.length, "Invalid project ID");
        Project memory project = projects[_projectId];
        return (project.name, project.description, project.voteCount);
    }

    function hasUserVoted(address _voter) public view returns(bool) {
        if (_voter == owner) {
            return false;
        }
        return hasVoted[_voter];
    }
}
