// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {SubsidyProgram} from "../src/SubsidyProgram.sol";
import {MockERC20} from "../test/mock/MockERC20.sol";

// TODO: fix the script to use the correct tokens

contract DeploySubsidyProgram is Script {
    uint256 constant INITIAL_SUPPLY = 1e5;
    address tokenAddress;

    function run() public returns (SubsidyProgram, address) {
        vm.startBroadcast();
        MockERC20 mockToken = new MockERC20(INITIAL_SUPPLY);
        vm.stopBroadcast();
        tokenAddress = address(mockToken);

        vm.startBroadcast();
        SubsidyProgram subsidyProgram = new SubsidyProgram(tokenAddress);
        vm.stopBroadcast();

        return (subsidyProgram, tokenAddress);
    }
}
