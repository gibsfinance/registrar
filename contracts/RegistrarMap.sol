// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { Registrar } from "./Registrar.sol";

contract RegistrarMap is Registrar {
    mapping(address claiment => mapping(bytes32 target => bytes claim)) public claims;
    constructor(address multicaller) Registrar(multicaller) {}
    function _claimSize(address writer, bytes32 key) internal view override returns(uint256) {
        return claims[writer][key].length;
    }
    function _updateClaim(address writer, bytes32 target, bytes calldata newClaim) internal override {
        claims[writer][target] = newClaim;
        emit ClaimUpdated(writer, target);
    }
}
