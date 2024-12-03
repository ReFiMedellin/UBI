// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SubsidyProgram is Ownable {
    struct User {
        uint256 lastClaimed;
        uint256 totalClaimed;
    }

    mapping(address => User) public addressToUser;

    uint256 public subsidyClaimInterval = 7 days;
    uint256 public subsidyClaimableAmount;
    IERC20 public token;

    event FundsAdded(uint256 amount, uint256 contractBalance);
    event FundsWithdrawed(uint256 amountWithdrawed);
    event BeneficiaryAdded(address indexed beneficiaryAddress);
    event BeneficiaryRemoved(address indexed beneficiaryAddress);
    event SubsidyClaimed(address indexed beneficiaryAddress, uint256 amount, uint256 contractBalance);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    function setClaimInterval(uint256 _interval) public onlyOwner {
        subsidyClaimInterval = _interval;
    }

    function setClaimableAmount(uint256 _amount) public onlyOwner {
        subsidyClaimableAmount = _amount;
    }

    function addFunds(uint256 _amount) public {
        emit FundsAdded(_amount, token.balanceOf(address(this)));
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed.");
    }

    function withdrawFunds() public onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        emit FundsWithdrawed(contractBalance);
        require(token.transfer(msg.sender, contractBalance), "Transfer failed.");
    }

    function addBeneficiary(address _userAddress) public onlyOwner {
        require(!isBeneficiary(_userAddress), "Already a beneficiary.");
        require(_userAddress != address(0), "Invalid address");
        emit BeneficiaryAdded(_userAddress);
        addressToUser[_userAddress] = User({lastClaimed: block.timestamp - subsidyClaimInterval, totalClaimed: 0});
    }

    function removeBeneficiary(address _userAddress) public onlyOwner {
        require(isBeneficiary(_userAddress), "Address is not a beneficiary.");
        emit BeneficiaryRemoved(_userAddress);
        addressToUser[_userAddress] = User(0, 0);
    }

    function claimSubsidy() public {
        require(isBeneficiary(msg.sender), "Address is not a beneficiary.");
        require(block.timestamp - addressToUser[msg.sender].lastClaimed >= subsidyClaimInterval, "Cannot claim yet.");

        addressToUser[msg.sender].lastClaimed = block.timestamp;
        addressToUser[msg.sender].totalClaimed += subsidyClaimableAmount;
        emit SubsidyClaimed(msg.sender, subsidyClaimableAmount, token.balanceOf(address(this)));
        require(token.transfer(msg.sender, subsidyClaimableAmount), "Not enough funds.");
    }

    function isBeneficiary(address _beneficiaryAddress) public view returns (bool) {
        return addressToUser[_beneficiaryAddress].lastClaimed != 0;
    }
}
