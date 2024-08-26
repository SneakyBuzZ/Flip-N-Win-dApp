// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

//ERRORS
error CoinFlip__GameIsOpen();
error CoinFlip__InvalidAmount();

contract CoinFlip is VRFConsumerBaseV2{
    //TYPES
    enum GameState {
        OPEN,
        CLOSED
    }

    //OWNER VARIABLES
    address payable immutable i_ownerAddress;

    //USER VARIABLES
    uint256 public i_betAmount;
    uint256  i_choice;

    //GAME VARIABLES
    GameState private s_gameStatus;

    //STATE VARIABLES FOR RANDOM NUMBER
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callBackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    uint256 requestId;
    uint256[] public randomWords;
    uint256 result;

    //EVENTS
    event RequestedRandomNumber(uint256 _requestId);

    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint256 subscriptionId,
        uint32 callBackGasLimit,
        address payable ownerAddress
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = uint64(subscriptionId);
        i_callBackGasLimit = callBackGasLimit;
        i_ownerAddress = ownerAddress;
        s_gameStatus = GameState.OPEN;
    }

    function placeBet(uint256 _amount, uint256 _choice) public payable {
        if (s_gameStatus == GameState.OPEN) {
            revert CoinFlip__GameIsOpen();
        }

        s_gameStatus = GameState.OPEN;

        if(msg.value != _amount){
            revert CoinFlip__InvalidAmount();
        }

        i_choice = _choice;
        i_betAmount = _amount;
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callBackGasLimit,
            NUM_WORDS
        );

        emit RequestedRandomNumber(requestId);

    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        requestId = _requestId;
        randomWords = _randomWords;

        // Determine the result based on the random number
        result = _randomWords[0] % 2;

        if (i_choice == result) {
            (bool success,) = payable(msg.sender).call{ value: (msg.value*2) }("");
            require(success, "Transfer failed");
        } else {
            // Optionally, send a portion of the bet amount to the contract owner
            (bool success,) = payable(i_ownerAddress).call{ value: (msg.value) }("");
            require(success, "Transfer failed");
        }

        s_gameStatus = GameState.CLOSED;
    }

    function getOwnerAddres() public view returns (address){
        return i_ownerAddress;
    }

    function getRecentResult() public view returns (uint256){
        return result;
    }
}