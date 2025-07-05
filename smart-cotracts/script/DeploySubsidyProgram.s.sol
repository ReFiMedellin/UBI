// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {SubsidyProgram} from "../src/SubsidyProgram.sol";
import {MockERC20, OtherMock} from "../test/mock/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeploySubsidyProgramTestnet is Script {
    uint256 constant INITIAL_SUPPLY = 1e5;
    address tokenAddress;
    address token2Address;

    function run() public returns (SubsidyProgram, address, address) {
        vm.startBroadcast();
        MockERC20 mockToken = new MockERC20(INITIAL_SUPPLY);
        OtherMock mockToken2 = new OtherMock(INITIAL_SUPPLY);
        vm.stopBroadcast();
        tokenAddress = address(mockToken);
        token2Address = address(mockToken2);

        vm.startBroadcast();
        SubsidyProgram subsidyProgram = new SubsidyProgram(tokenAddress);
        vm.stopBroadcast();

        return (subsidyProgram, tokenAddress, token2Address);
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
