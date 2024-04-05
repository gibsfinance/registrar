// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { LibMulticaller } from "multicaller/LibMulticaller.sol";
import { Multicallable } from "solady/utils/Multicallable.sol";

abstract contract Registrar is Multicallable {
    address immutable public MULTICALLER_WITH_SIGNER;
    event ClaimUpdated(address indexed claiment, bytes32 indexed target);
    constructor(address multicaller) {
        MULTICALLER_WITH_SIGNER = multicaller;
    }
    function _msgSender() internal view returns(address) {
        return LibMulticaller.getAt(MULTICALLER_WITH_SIGNER);
    }
    function createClaim(bytes32 target, bytes calldata newClaim) external returns(bool) {
        address writer = _msgSender();
        if (_claimSize(writer, target) != 0 || newClaim.length == 0) {
            return false;
        }
        _updateClaim(writer, target, newClaim);
        return true;
    }
    function updateClaim(bytes32 target, bytes calldata newClaim) external {
        _updateClaim(_msgSender(), target, newClaim);
    }
    function _claimSize(address writer, bytes32 key) internal virtual returns(uint256);
    function _updateClaim(address writer, bytes32 target, bytes calldata newClaim) internal virtual;
}
