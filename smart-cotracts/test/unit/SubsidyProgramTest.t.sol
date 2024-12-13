// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {DeploySubsidyProgramTestnet} from "../../script/DeploySubsidyProgram.s.sol";
import {SubsidyProgram} from "../../src/SubsidyProgram.sol";
import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SubsidyProgramTest is Test {
    SubsidyProgram subsidyProgram;
    IERC20 token;

    uint256 constant INTERVAL_TIME = 2 weeks;
    uint256 constant TOKEN_AMOUNT = 500;
    uint256 constant TEN_YEARS = 365 * 10 days;

    address constant USER = address(1);

    function setUp() external {
        DeploySubsidyProgramTestnet deployer = new DeploySubsidyProgramTestnet();
        (SubsidyProgram subsidyProgram_, address tokenAddress) = deployer.run();
        subsidyProgram = subsidyProgram_;
        token = IERC20(tokenAddress);
    }

    function testClaimIntervalSetCorrectly() public {
        vm.prank(msg.sender);
        subsidyProgram.setClaimInterval(INTERVAL_TIME);
        assertEq(subsidyProgram.subsidyClaimInterval(), INTERVAL_TIME);
    }

    function testClaimIntervalSetFailsIfNotOwner() public {
        vm.expectRevert();
        subsidyProgram.setClaimInterval(INTERVAL_TIME);
    }

    function testClaimableAmountSetCorrectly() public {
        vm.prank(msg.sender);
        subsidyProgram.setClaimableAmount(TOKEN_AMOUNT);
        assertEq(subsidyProgram.subsidyClaimableAmount(), TOKEN_AMOUNT);
    }

    function testClaimableAmountSetFailsIfNotOwner() public {
        vm.expectRevert();
        subsidyProgram.setClaimableAmount(TOKEN_AMOUNT);
    }

    function testAddFundsCorrectly() public {
        vm.startPrank(msg.sender);
        token.approve(address(subsidyProgram), TOKEN_AMOUNT);
        subsidyProgram.addFunds(TOKEN_AMOUNT);
        vm.stopPrank();
        assertEq(token.balanceOf(address(subsidyProgram)), TOKEN_AMOUNT);
    }

    function testAddFundsFails() public {
        vm.expectRevert();
        subsidyProgram.addFunds(TOKEN_AMOUNT);
    }

    function testWithdrawFundsCorrectly() public {
        uint256 initialBalance = token.balanceOf(msg.sender);
        vm.startPrank(msg.sender);
        token.approve(address(subsidyProgram), TOKEN_AMOUNT);
        subsidyProgram.addFunds(TOKEN_AMOUNT);

        subsidyProgram.withdrawFunds();
        vm.stopPrank();

        assertEq(token.balanceOf(address(subsidyProgram)), 0);
        assertEq(token.balanceOf(msg.sender), initialBalance);
    }

    function testWithdrawFundsFailsIfNotOwner() public {
        vm.expectRevert();
        subsidyProgram.withdrawFunds();
    }

    function testAddBeneficiaryCorrectly() public {
        vm.warp(TEN_YEARS);
        vm.prank(msg.sender);
        subsidyProgram.addBeneficiary(USER);

        assert(subsidyProgram.isBeneficiary(USER));
    }

    function testAddBeneficiaryFailsIfZeroAddress() public {
        vm.warp(TEN_YEARS);
        vm.prank(msg.sender);
        vm.expectRevert();
        subsidyProgram.addBeneficiary(address(0));
    }

    function testAddBeneficiaryFailsIfNotOwner() public {
        vm.warp(TEN_YEARS);
        vm.expectRevert();
        subsidyProgram.addBeneficiary(USER);
    }

    function testAddBeneficiaryFailsIfAlreadyIs() public {
        vm.warp(TEN_YEARS);
        vm.startPrank(msg.sender);
        subsidyProgram.addBeneficiary(USER);

        vm.expectRevert();
        subsidyProgram.addBeneficiary(USER);

        vm.stopPrank();
    }

    function testRemoveBeneficiaryCorrectly() public {
        vm.warp(TEN_YEARS);
        vm.startPrank(msg.sender);
        subsidyProgram.addBeneficiary(USER);
        subsidyProgram.removeBeneficiary(USER);
        vm.stopPrank();

        (uint256 lastClaimed,) = subsidyProgram.addressToUser(USER);
        assertEq(lastClaimed, 0);
    }

    function testRemoveBeneficiaryFailsIfNotBeneficiary() public {
        vm.warp(TEN_YEARS);
        vm.startPrank(msg.sender);
        subsidyProgram.addBeneficiary(USER);

        vm.expectRevert();
        subsidyProgram.removeBeneficiary(address(2));
        vm.stopPrank();
    }

    function testRemoveBeneficiaryCorrectlyIfMultiple() public {
        vm.warp(TEN_YEARS);

        uint160 numberOfBeneficiaries = 5;
        uint160 startIndex = 2;

        vm.startPrank(msg.sender);
        subsidyProgram.addBeneficiary(USER);
        for (uint160 i = startIndex; i <= numberOfBeneficiaries; i++) {
            subsidyProgram.addBeneficiary(address(i));
        }
        subsidyProgram.removeBeneficiary(USER);
        vm.stopPrank();

        bool isBeneficiary = subsidyProgram.isBeneficiary(USER);

        assertFalse(isBeneficiary);
    }

    function testClaimSubsidyCorrectly() public {
        vm.warp(TEN_YEARS);

        vm.startPrank(msg.sender);
        token.approve(address(subsidyProgram), TOKEN_AMOUNT);
        subsidyProgram.addFunds(TOKEN_AMOUNT);
        subsidyProgram.setClaimableAmount(TOKEN_AMOUNT);
        subsidyProgram.addBeneficiary(USER);
        vm.stopPrank();

        vm.prank(USER);
        subsidyProgram.claimSubsidy();

        assertEq(token.balanceOf(USER), TOKEN_AMOUNT);
    }

    function testClaimSubsidyFailsIfNotBeneficiary() public {
        vm.warp(TEN_YEARS);

        address beneficiary = address(2);

        vm.startPrank(msg.sender);
        token.approve(address(subsidyProgram), TOKEN_AMOUNT);
        subsidyProgram.addFunds(TOKEN_AMOUNT);
        subsidyProgram.setClaimableAmount(TOKEN_AMOUNT);
        subsidyProgram.addBeneficiary(beneficiary);
        vm.stopPrank();

        vm.expectRevert();
        vm.prank(USER);
        subsidyProgram.claimSubsidy();
    }

    function testClaimSubsidyFailsIfNotEnoughTime() public {
        vm.warp(TEN_YEARS);

        vm.startPrank(msg.sender);
        token.approve(address(subsidyProgram), TOKEN_AMOUNT);
        subsidyProgram.addFunds(TOKEN_AMOUNT);
        subsidyProgram.setClaimableAmount(TOKEN_AMOUNT);
        subsidyProgram.addBeneficiary(USER);
        vm.stopPrank();

        vm.startPrank(USER);
        subsidyProgram.claimSubsidy();

        vm.warp(1 hours);

        vm.expectRevert();
        subsidyProgram.claimSubsidy();
        vm.stopPrank();
    }

    function testClaimSubsidyFailsIfNotEnoughFunds() public {
        vm.warp(TEN_YEARS);

        vm.startPrank(msg.sender);
        subsidyProgram.setClaimableAmount(TOKEN_AMOUNT);
        subsidyProgram.addBeneficiary(USER);
        vm.stopPrank();

        vm.expectRevert();
        vm.prank(USER);
        subsidyProgram.claimSubsidy();
    }
}
