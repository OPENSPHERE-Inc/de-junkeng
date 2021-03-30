// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * Runtime target: EVM
 */
contract JunkCoinERC20 is ERC20 {

    constructor(string memory _name, string memory _symbol, uint _initialSupplies) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupplies);
    }

    function decimals() public view override returns (uint8) {
        return 0;
    }
}
