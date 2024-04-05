// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "multicaller/MulticallerWithSigner.sol";
import "contracts/RegistrarMap.sol";

contract RegistrarMapTest is Test {
    RegistrarMap public registrarMap;
    MulticallerWithSigner public multicallerWithSigner;

    bytes constant a = abi.encodePacked("");
    bytes constant b = abi.encodePacked(uint8(0));
    bytes constant c = abi.encodePacked(uint8(1));

    function setUp() public {
        multicallerWithSigner = new MulticallerWithSigner();
        registrarMap = new RegistrarMap(address(multicallerWithSigner));
    }
    function testCreateClaim(bytes32 key) public {
        assertEq(registrarMap.createClaim(key, a), false);
        assertEq(registrarMap.createClaim(key, b), true);
        assertEq(registrarMap.createClaim(key, b), false);
    }
    function testUpdateClaim(bytes32 key) public {
        assertEq(registrarMap.claims(address(this), key), a);
        registrarMap.createClaim(key, b);
        assertEq(registrarMap.claims(address(this), key), b);
        registrarMap.updateClaim(key, c);
        assertEq(registrarMap.claims(address(this), key), c);
    }
    function testUpdateAsUpsertClaim(bytes32 key) public {
        registrarMap.updateClaim(key, b);
        assertEq(registrarMap.claims(address(this), key), b);
        registrarMap.updateClaim(key, c);
        assertEq(registrarMap.claims(address(this), key), c);
    }
}
