// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract PredictionMarket {
    struct Market {
        address creator;
        string question;
        string[] options;
        uint256 deadline;
        uint256 totalPool;
        uint256 winningOption;
        bool resolved;
        bool exists;
    }

    address public treasury;
    uint256 public constant PLATFORM_FEE_BPS = 200; // 2%
    uint256 public marketCount;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(uint256 => uint256)) public optionPools; // marketId => optionIndex => total
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) public userBets; // marketId => user => option => amount
    mapping(uint256 => mapping(address => bool)) public claimed;

    event MarketCreated(uint256 indexed marketId, address indexed creator, string question, uint256 deadline);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, uint256 optionIndex, uint256 amount);
    event MarketResolved(uint256 indexed marketId, uint256 winningOption);
    event RewardClaimed(uint256 indexed marketId, address indexed claimer, uint256 amount);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function createMarket(
        string calldata question,
        string[] calldata options,
        uint256 deadline
    ) external returns (uint256) {
        require(options.length >= 2, "Need at least 2 options");
        require(options.length <= 10, "Too many options");
        require(deadline > block.timestamp + 1 hours, "Deadline too soon");

        uint256 marketId = marketCount++;
        Market storage m = markets[marketId];
        m.creator = msg.sender;
        m.question = question;
        m.deadline = deadline;
        m.exists = true;
        for (uint256 i = 0; i < options.length; i++) {
            m.options.push(options[i]);
        }

        emit MarketCreated(marketId, msg.sender, question, deadline);
        return marketId;
    }

    function placeBet(uint256 marketId, uint256 optionIndex) external payable {
        Market storage m = markets[marketId];
        require(m.exists, "Market does not exist");
        require(!m.resolved, "Market already resolved");
        require(block.timestamp < m.deadline, "Betting closed");
        require(optionIndex < m.options.length, "Invalid option");
        require(msg.value > 0, "Bet amount must be > 0");

        m.totalPool += msg.value;
        optionPools[marketId][optionIndex] += msg.value;
        userBets[marketId][msg.sender][optionIndex] += msg.value;

        emit BetPlaced(marketId, msg.sender, optionIndex, msg.value);
    }

    function resolveMarket(uint256 marketId, uint256 winningOption) external {
        Market storage m = markets[marketId];
        require(m.exists, "Market does not exist");
        require(msg.sender == m.creator, "Only creator can resolve");
        require(!m.resolved, "Already resolved");
        require(block.timestamp >= m.deadline, "Betting not closed yet");
        require(winningOption < m.options.length, "Invalid option");

        m.resolved = true;
        m.winningOption = winningOption;

        // Send platform fee to treasury
        uint256 fee = (m.totalPool * PLATFORM_FEE_BPS) / 10000;
        if (fee > 0) {
            (bool sent, ) = treasury.call{value: fee}("");
            require(sent, "Fee transfer failed");
        }

        emit MarketResolved(marketId, winningOption);
    }

    function claimReward(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.exists, "Market does not exist");
        require(m.resolved, "Market not resolved");
        require(!claimed[marketId][msg.sender], "Already claimed");

        uint256 userBet = userBets[marketId][msg.sender][m.winningOption];
        require(userBet > 0, "No winning bet");

        claimed[marketId][msg.sender] = true;

        uint256 winnerPool = optionPools[marketId][m.winningOption];
        uint256 rewardPool = m.totalPool - (m.totalPool * PLATFORM_FEE_BPS) / 10000;
        uint256 reward = (userBet * rewardPool) / winnerPool;

        (bool sent, ) = msg.sender.call{value: reward}("");
        require(sent, "Reward transfer failed");

        emit RewardClaimed(marketId, msg.sender, reward);
    }

    function getMarket(uint256 marketId) external view returns (
        address creator,
        string memory question,
        string[] memory options,
        uint256 deadline,
        uint256 totalPool,
        uint256 winningOption,
        bool resolved
    ) {
        Market storage m = markets[marketId];
        require(m.exists, "Market does not exist");
        return (m.creator, m.question, m.options, m.deadline, m.totalPool, m.winningOption, m.resolved);
    }

    function getOptionPool(uint256 marketId, uint256 optionIndex) external view returns (uint256) {
        return optionPools[marketId][optionIndex];
    }

    function getUserBet(uint256 marketId, address user, uint256 optionIndex) external view returns (uint256) {
        return userBets[marketId][user][optionIndex];
    }
}
