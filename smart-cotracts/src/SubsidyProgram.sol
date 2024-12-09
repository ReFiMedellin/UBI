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
    event SubsidyClaimed(
        address indexed beneficiaryAddress,
        uint256 amount,
        uint256 contractBalance
    );
    event ClaimIntervalSet(uint256 interval);
    event ClaimableAmountSet(uint256 amount);
    event TokenAddressSet(address tokenAddress);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    function setClaimInterval(uint256 _interval) external onlyOwner {
        subsidyClaimInterval = _interval;
        emit ClaimIntervalSet(interval);
    }

    function setClaimableAmount(uint256 _amount) external onlyOwner {
        subsidyClaimableAmount = _amount;
        emit ClaimableAmountSet(_amount);
    }

    function setTokenAddress(address _tokenAddress) external onlyOwner {
        token = IERC20(_tokenAddress);
        emit TokenAddressSet(_tokenAddress);
    }

    function addFunds(uint256 _amount) external {
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed."
        );
        emit FundsAdded(_amount, token.balanceOf(address(this)) + _amount);
    }

    function withdrawFunds() external onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        require(
            token.transfer(msg.sender, contractBalance),
            "Transfer failed."
        );
        emit FundsWithdrawed(contractBalance);
    }

    function addBeneficiary(address _userAddress) external onlyOwner {
        require(!isBeneficiary(_userAddress), "Already a beneficiary.");
        require(_userAddress != address(0), "Invalid address");
        addressToUser[_userAddress] = User({
            lastClaimed: block.timestamp - subsidyClaimInterval,
            totalClaimed: 0
        });
        emit BeneficiaryAdded(_userAddress);
    }

    function removeBeneficiary(address _userAddress) external onlyOwner {
        require(isBeneficiary(_userAddress), "Address is not a beneficiary.");
        addressToUser[_userAddress] = User(0, 0);
        emit BeneficiaryRemoved(_userAddress);
    }

    function claimSubsidy() public {
        require(isBeneficiary(msg.sender), "Address is not a beneficiary.");
        require(
            block.timestamp - addressToUser[msg.sender].lastClaimed >=
                subsidyClaimInterval,
            "Cannot claim yet."
        );

        addressToUser[msg.sender].lastClaimed = block.timestamp;
        addressToUser[msg.sender].totalClaimed += subsidyClaimableAmount;
        require(
            token.transfer(msg.sender, subsidyClaimableAmount),
            "Not enough funds."
        );
        emit SubsidyClaimed(
            msg.sender,
            subsidyClaimableAmount,
            token.balanceOf(address(this))
        );
    }

    function isBeneficiary(
        address _beneficiaryAddress
    ) public view returns (bool) {
        return addressToUser[_beneficiaryAddress].lastClaimed != 0;
    }
}
