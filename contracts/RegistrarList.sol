// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { Registrar } from "./Registrar.sol";
// use registrar list if the list is short enough to
// handle via direct (multi) calls to the blockchain
// and you need harder censorship resistance (no backend)
contract RegistrarList is Registrar {
    mapping(address claiment => mapping(bytes32 target => bytes[])) public lists;
    constructor(address multicaller) Registrar(multicaller) {}
    function _updateClaim(address writer, bytes32 target, bytes calldata newClaim) internal override {
        lists[writer][target].push(newClaim);
        // to help this not just be an endless string, the best
        // thing to do is simply make it costly to make the byte list long
        emit ClaimUpdated(writer, target);
    }
    function _claimSize(address writer, bytes32 key) internal view override returns(uint256) {
        bytes[] storage list = lists[writer][key];
        if (list.length == 0) {
            return 0;
        }
        return list[list.length - 1].length;
    }
    function _claim(address writer, bytes32 target) internal view returns(bytes memory) {
        bytes[] storage list = lists[writer][target];
        if (list.length == 0) {
            return bytes("");
        }
        return list[list.length - 1];
    }
    function latest(address writer, bytes32 target) external view returns(bytes memory) {
        return _claim(writer, target);
    }
    function length(address writer, bytes32 target) external view returns(uint256) {
        return lists[writer][target].length;
    }
    function claimSizeAt(address writer, bytes32 target, uint256 index) external view returns(uint256) {
        return lists[writer][target][index].length;
    }
}
