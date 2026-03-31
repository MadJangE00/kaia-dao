// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract GroupManager {
    struct Group {
        address owner;
        string name;
        uint256 memberCount;
        bool exists;
    }

    uint256 public groupCount;
    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => bool)) public isMember;

    event GroupCreated(uint256 indexed groupId, address indexed owner, string name);
    event MemberJoined(uint256 indexed groupId, address indexed member);
    event MemberLeft(uint256 indexed groupId, address indexed member);

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].exists, "Group does not exist");
        _;
    }

    function createGroup(string calldata name) external returns (uint256) {
        uint256 groupId = groupCount++;
        groups[groupId] = Group({
            owner: msg.sender,
            name: name,
            memberCount: 1,
            exists: true
        });
        isMember[groupId][msg.sender] = true;

        emit GroupCreated(groupId, msg.sender, name);
        emit MemberJoined(groupId, msg.sender);
        return groupId;
    }

    function joinGroup(uint256 groupId) external groupExists(groupId) {
        require(!isMember[groupId][msg.sender], "Already a member");
        isMember[groupId][msg.sender] = true;
        groups[groupId].memberCount++;

        emit MemberJoined(groupId, msg.sender);
    }

    function leaveGroup(uint256 groupId) external groupExists(groupId) {
        require(isMember[groupId][msg.sender], "Not a member");
        require(groups[groupId].owner != msg.sender, "Owner cannot leave");
        isMember[groupId][msg.sender] = false;
        groups[groupId].memberCount--;

        emit MemberLeft(groupId, msg.sender);
    }

    function getGroup(uint256 groupId) external view returns (address owner, string memory name, uint256 memberCount) {
        Group storage g = groups[groupId];
        require(g.exists, "Group does not exist");
        return (g.owner, g.name, g.memberCount);
    }
}
