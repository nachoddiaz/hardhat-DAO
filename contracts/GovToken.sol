// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovToken is ERC20Votes{
    //Token suply is 1M Tokens
    uint256 public s_maxSupply = 1000000000000000000000000;

    constructor() 
        ERC20("OnixDAO", "OD") 
        ERC20Permit("OnixDAO")
    {
        //safeMint is only available in ERC721 tokens
        _mint(msg.sender, s_maxSupply);
    }

    //those following function are override functions needed by solidity to allow the snapshot to execute correctly
    //Thse super. allows to call the following function that is in the ERC20Votes contract
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Votes){
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes){
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes){
        super._burn(account, amount);
    }
}