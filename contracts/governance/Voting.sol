// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./GroupManager.sol";

contract Voting {
    enum VoteType { Against, For, Abstain }
    enum ProposalStatus { Active, Passed, Failed }

    struct Proposal {
        uint256 groupId;
        address creator;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 deadline;
        ProposalStatus status;
        bool finalized;
    }

    GroupManager public groupManager;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, uint256 indexed groupId, address indexed creator, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, VoteType voteType);
    event ProposalFinalized(uint256 indexed proposalId, ProposalStatus status);

    constructor(address _groupManager) {
        groupManager = GroupManager(_groupManager);
    }

    function createProposal(
        uint256 groupId,
        string calldata title,
        string calldata description,
        uint256 durationInSeconds
    ) external returns (uint256) {
        require(groupManager.isMember(groupId, msg.sender), "Not a group member");
        require(durationInSeconds >= 1 hours, "Duration too short");
        require(durationInSeconds <= 30 days, "Duration too long");

        uint256 proposalId = proposalCount++;
        proposals[proposalId] = Proposal({
            groupId: groupId,
            creator: msg.sender,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            deadline: block.timestamp + durationInSeconds,
            status: ProposalStatus.Active,
            finalized: false
        });

        emit ProposalCreated(proposalId, groupId, msg.sender, title);
        return proposalId;
    }

    function castVote(uint256 proposalId, VoteType voteType) external {
        Proposal storage p = proposals[proposalId];
        require(p.deadline > 0, "Proposal does not exist");
        require(block.timestamp < p.deadline, "Voting ended");
        require(!p.finalized, "Already finalized");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(groupManager.isMember(p.groupId, msg.sender), "Not a group member");

        hasVoted[proposalId][msg.sender] = true;

        if (voteType == VoteType.For) {
            p.forVotes++;
        } else if (voteType == VoteType.Against) {
            p.againstVotes++;
        } else {
            p.abstainVotes++;
        }

        emit VoteCast(proposalId, msg.sender, voteType);
    }

    function finalizeProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(p.deadline > 0, "Proposal does not exist");
        require(block.timestamp >= p.deadline, "Voting not ended");
        require(!p.finalized, "Already finalized");

        p.finalized = true;
        p.status = p.forVotes > p.againstVotes ? ProposalStatus.Passed : ProposalStatus.Failed;

        emit ProposalFinalized(proposalId, p.status);
    }

    function getProposal(uint256 proposalId) external view returns (
        uint256 groupId,
        address creator,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        uint256 deadline,
        ProposalStatus status,
        bool finalized
    ) {
        Proposal storage p = proposals[proposalId];
        return (p.groupId, p.creator, p.title, p.description, p.forVotes, p.againstVotes, p.abstainVotes, p.deadline, p.status, p.finalized);
    }
}
