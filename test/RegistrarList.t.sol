// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "multicaller/MulticallerWithSigner.sol";
import "contracts/RegistrarList.sol";

contract RegistrarListTest is Test {
    RegistrarList public registrarList;
    MulticallerWithSigner public multicallerWithSigner;

    bytes constant a = abi.encodePacked("");
    bytes constant b = abi.encodePacked(uint8(0));
    bytes constant c = abi.encodePacked(uint8(1));

    function setUp() public {
        multicallerWithSigner = new MulticallerWithSigner();
        registrarList = new RegistrarList(address(multicallerWithSigner));
    }

    function testCreateClaim(bytes32 key) public {
        assertEq(registrarList.createClaim(key, a), false);
        assertEq(registrarList.createClaim(key, b), true);
        assertEq(registrarList.createClaim(key, b), false);
    }
    function testUpdateClaim(bytes32 key) public {
        assertEq(registrarList.latest(address(this), key), a);
        registrarList.createClaim(key, b);
        assertEq(registrarList.latest(address(this), key), b);
        registrarList.updateClaim(key, c);
        assertEq(registrarList.latest(address(this), key), c);
    }
    function testUpdateAsUpsertClaim(bytes32 key) public {
        registrarList.updateClaim(key, b);
        assertEq(registrarList.latest(address(this), key), b);
        registrarList.updateClaim(key, c);
        assertEq(registrarList.latest(address(this), key), c);
    }
    function testLength(bytes32 key) public {
        assertEq(registrarList.length(address(this), key), 0);
        registrarList.updateClaim(key, b);
        assertEq(registrarList.length(address(this), key), 1);
        registrarList.updateClaim(key, c);
        assertEq(registrarList.length(address(this), key), 2);
    }
    function testClaimSizeAt(bytes32 key) public {
        registrarList.updateClaim(key, b);
        assertEq(registrarList.claimSizeAt(address(this), key, 0), 1);
        registrarList.updateClaim(key, c);
        assertEq(registrarList.claimSizeAt(address(this), key, 1), 1);
    }
}
