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

    IERC20[] public tokens;

    event FundsAdded(uint256 amount, address tokenAddress, uint256 tokenBalance);
    event FundsWithdrawed(address tokenAddress, uint256 amountWithdrawed);
    event BeneficiaryAdded(address indexed beneficiaryAddress);
    event BeneficiaryRemoved(address indexed beneficiaryAddress);
    event SubsidyClaimed(
        address indexed beneficiaryAddress,
        uint256 amount,
        uint256 contractBalance
    );
    event ClaimIntervalSet(uint256 interval);
    event ClaimableAmountSet(uint256 amount);
    event TokenAdded(address indexed tokenAddress);
    event TokenRemoved(address indexed tokenAddress);
    event TokenPriorityChanged(
        address indexed tokenAddress,
        uint256 previousPriority,
        uint256 newPriority
    );

    constructor(address _tokenAddress) Ownable(msg.sender) {
        tokens.push(IERC20(_tokenAddress));
    }

    function setClaimInterval(uint256 _interval) external onlyOwner {
        subsidyClaimInterval = _interval;
        emit ClaimIntervalSet(_interval);
    }

    function setClaimableAmount(uint256 _amount) external onlyOwner {
        subsidyClaimableAmount = _amount;
        emit ClaimableAmountSet(_amount);
    }

    function addToken(address _tokenAddress) external onlyOwner {
        (bool alreadyAccepted,) = isAcceptedToken(_tokenAddress);
        require(!alreadyAccepted, "The token is already whitelisted.");
        tokens.push(IERC20(_tokenAddress));
        emit TokenAdded(_tokenAddress);
    }

    function removeToken(address _tokenAddress) external onlyOwner {
        (bool whitelisted, uint256 index) = isAcceptedToken(_tokenAddress);
        require(whitelisted, "This token isn't whitelisted.");
        require(tokens.length > 1, "Cannot remove all tokens.");

        for (uint256 i = index; i < tokens.length - 1; i++) {
            IERC20 temp = tokens[i];
            tokens[i] = tokens[i + 1];
            tokens[i + 1] = temp;
        }

        tokens.pop();
        emit TokenRemoved(_tokenAddress);
    }

    function changeTokenPriority(address _tokenAddress, uint256 priority) external onlyOwner {
        require(priority < tokens.length, "Priority number out of bounds.");
        (bool whitelisted, uint256 index) = isAcceptedToken(_tokenAddress);
        require(whitelisted, "This token isn't whitelisted");
        IERC20 tokenToChange = tokens[index];
        tokens[index] = tokens[priority];
        tokens[priority] = tokenToChange;

        emit TokenPriorityChanged(_tokenAddress, index, priority);
        emit TokenPriorityChanged(address(tokens[priority]), priority, index); // Maybe this isn't a good API
    }

    function addFunds(uint256 _amount, address _tokenAddress) external {
        (bool accepted, uint256 index) = isAcceptedToken(_tokenAddress);

        require(accepted, "This token isn't whitelisted.");
        require(
            tokens[index].transferFrom(msg.sender, address(this), _amount),
            "Transfer failed."
        );

        emit FundsAdded(
            _amount,
            address(tokens[index]),
            tokens[index].balanceOf(address(this))
        );
    }

    function withdrawFunds(address _tokenAddress) external onlyOwner {
        (bool accepted, uint256 index) = isAcceptedToken(_tokenAddress);
        require(accepted, "The contract doesn't have this token in balance.");
        uint256 contractBalance = tokens[index].balanceOf(address(this));
        require(
            tokens[index].transfer(msg.sender, contractBalance),
            "Transfer failed."
        );
        emit FundsWithdrawed(address(tokens[index]), contractBalance);
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
        // TODO: Use uniswap and pools to swap high priority tokens for cCop
        require(
            tokens[0].transfer(msg.sender, subsidyClaimableAmount),
            "Not enough funds."
        );
        emit SubsidyClaimed(
            msg.sender,
            subsidyClaimableAmount,
            tokens[0].balanceOf(address(this))
        );
    }

    function getWhitelistedTokens() public view returns (IERC20[] memory) {
        return tokens;
    }

    function isAcceptedToken(
        address _tokenAddress
      ) public view returns (bool, uint256) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (address(tokens[i]) == _tokenAddress) return (true, i);
        }
        return (false, 2**255);
    }

    function isBeneficiary(
        address _beneficiaryAddress
    ) public view returns (bool) {
        return addressToUser[_beneficiaryAddress].lastClaimed != 0;
    }
}
