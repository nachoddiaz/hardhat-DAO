// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    event ValueChanged(uint256 newValue);

    function storeValue(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(value);
    }

    function retrive() public view returns (uint256) {
        return value;
    }

    //Getters
    function getStoreValue() external view returns (uint256) {
        return value;
    }
}
