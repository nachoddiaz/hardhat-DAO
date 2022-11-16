//Owner of the Box contract, allows the token holders to vote.
//Once a proposal has passed, it doesnt executes immediatly

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        uint256 minDelay, //How long you have to wait before execute the proposal
        address[] memory proposers, //A list with the addresses that can propose
        address[] memory executors, //A list with the addresses that can execute
        address admin //The admin address
    ) TimelockController(minDelay, proposers, executors, admin) {
        
    }
}
