// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import { JunkCoinERC20 } from "./JunkCoinERC20.sol";
import { Abs_L2DepositedToken } from "@eth-optimism/contracts/build/contracts/OVM/bridge/tokens/Abs_L2DepositedToken.sol";

/**
 * Runtime target: OVM
 */
contract JunkCoinDepositedERC20 is Abs_L2DepositedToken, JunkCoinERC20 {

    address admin;
    address dispenser;

    constructor(
        address _l2CrossDomainMessenger,
        string memory _name,
        string memory _symbol
    )
        Abs_L2DepositedToken(_l2CrossDomainMessenger)
        JunkCoinERC20(_name, _symbol, 0)
    {
        admin = msg.sender;
    }

    /**
     * Associate dispenser account/contract
     */
    function setDispenser(address _dispenser) external {
        require(msg.sender == admin, "Permission denied.");
        dispenser = _dispenser;
    }

    function _handleInitiateWithdrawal(
        address _to,
        uint _amount
    )
        internal
        override
    {
        require(msg.sender == _to || (dispenser != address(0) && msg.sender == dispenser), "Permission denied.");
        _burn(_to, _amount);
    }

    function _handleFinalizeDeposit(
        address _to,
        uint _amount
    )
        internal
        override
    {
        _mint(_to, _amount);
    }
}
