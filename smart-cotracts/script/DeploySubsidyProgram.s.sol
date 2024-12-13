// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {SubsidyProgram} from "../src/SubsidyProgram.sol";
import {MockERC20} from "../test/mock/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeploySubsidyProgramTestnet is Script {
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

contract DeploySubsidyProgram is Script {
    address token = vm.envAddress("TOKEN_ADDRESS");

    function run() public returns (SubsidyProgram, address) {
        vm.startBroadcast();
        SubsidyProgram subsidyProgram = new SubsidyProgram(token);
        vm.stopBroadcast();

        console.log("Subsidy program deployed at: ", address(subsidyProgram));

        return (subsidyProgram, token);
    }
}
