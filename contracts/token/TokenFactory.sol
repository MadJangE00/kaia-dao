// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./CustomToken.sol";

contract TokenFactory {
    mapping(address => address[]) public creatorTokens;
    address[] public allTokens;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 initialSupply
    );

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external returns (address) {
        require(initialSupply > 0, "Supply must be > 0");

        CustomToken token = new CustomToken(name, symbol, initialSupply, msg.sender);
        address tokenAddress = address(token);

        creatorTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);

        emit TokenCreated(tokenAddress, msg.sender, name, symbol, initialSupply);
        return tokenAddress;
    }

    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }
}
