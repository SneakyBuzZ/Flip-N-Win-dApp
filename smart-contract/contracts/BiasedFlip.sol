// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
// Uncomment this line to use console.log
// import "hardhat/console.sol";

//ERRORS
error CoinFlip__GameIsOpen();
error CoinFlip__InvalidAmount();

contract BiasedFlip{
    //TYPES
    enum GameState {
        OPEN,
        CLOSED
    }

    //OWNER VARIABLES
    address payable immutable i_ownerAddress;

    //GAME VARIABLES
    GameState private s_gameStatus;


    constructor(
        address payable ownerAddress
    ){
        i_ownerAddress = ownerAddress;
    }

    function placeBet(uint256 _amount, uint256 _choice,  uint256 _coinSide) public payable {
        if (s_gameStatus == GameState.OPEN) {
            revert CoinFlip__GameIsOpen();
        }

        s_gameStatus = GameState.OPEN;

        if(msg.value != _amount){
            revert CoinFlip__InvalidAmount();
        }

        if (_choice == _coinSide) {
            (bool success,) = payable(msg.sender).call{ value: (msg.value*2) }("");
            require(success, "Transfer failed");
        } else {
            // Optionally, send a portion of the bet amount to the contract owner
            (bool success,) = payable(i_ownerAddress).call{ value: (msg.value) }("");
            require(success, "Transfer failed");
        }
    }


    function getOwnerAddres() public view returns (address){
        return i_ownerAddress;
    }
}

