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

    address[] private tokens;
    mapping(address => uint256) private tokenIndex;

    event FundsAdded(uint256 amount, address tokenAddress, uint256 tokenBalance);
    event FundsWithdrawn(address tokenAddress, uint256 amountWithdrawed);
    event BeneficiaryAdded(address indexed beneficiaryAddress);
    event BeneficiaryRemoved(address indexed beneficiaryAddress);
    event SubsidyClaimed(
        address indexed beneficiaryAddress,
        uint256 amount,
        uint256 contractBalance
    );
    event ClaimIntervalSet(uint256 interval);
    event ClaimableAmountSet(uint256 amount);
    event TokenAdded(address indexed tokenAddress, uint256 newIndex);
    event TokenRemoved(address indexed tokenAddress);
    event TokenPriorityChanged(
        address indexed tokenAddress,
        uint256 oldIndex,
        uint256 newIndex
    );

    constructor(address _tokenAddress) Ownable(msg.sender) {
        tokens.push(_tokenAddress);
        tokenIndex[_tokenAddress] = 1;
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
        require(_tokenAddress != address(0), "Zero token");
        require(tokenIndex[_tokenAddress] == 0, "The token is already whitelisted.");
        tokens.push(_tokenAddress);
        tokenIndex[_tokenAddress] = tokens.length;
        emit TokenAdded(_tokenAddress, tokens.length - 1);
    }

    function removeToken(address _tokenAddress) external onlyOwner {
        uint256 idx1 = tokenIndex[_tokenAddress];
        require(idx1 != 0, "This token isn't whitelisted.");
        require(tokens.length > 1, "Cannot remove all tokens.");

        for (uint256 i = idx1 - 1; i < tokens.length - 1; i++) {
            tokens[i] = tokens[i + 1];
            tokenIndex[tokens[i]] = i + 1;
        }

        tokens.pop();
        tokenIndex[_tokenAddress] = 0;
        emit TokenRemoved(_tokenAddress);
    }

    function changeTokenPriority(address _tokenAddress, uint256 _newIndex) external onlyOwner {
        require(_newIndex < tokens.length, "New index out of bounds.");
        require(tokenIndex[_tokenAddress] != 0, "This token isn't whitelisted");

        uint256 oldIndex = tokenIndex[_tokenAddress] - 1;
        if (oldIndex == _newIndex) return;

        address tokenToChange = tokens[oldIndex];
        if (oldIndex < _newIndex) {
            // shift to the left
            for (uint256 i = oldIndex; i < _newIndex; i++) {
                tokens[i] = tokens[i + 1];
                tokenIndex[tokens[i]] = i + 1;
            }
        } else {
            // shift to the right
            for (uint256 i = oldIndex; i > _newIndex; i--) {
                tokens[i] = tokens[i - 1];
                tokenIndex[tokens[i]] = i - 1;
            }
        }

        tokens[_newIndex] = tokenToChange;
        tokenIndex[tokenToChange] = _newIndex + 1;

        emit TokenPriorityChanged(_tokenAddress, oldIndex, _newIndex);
    }

    function addFunds(uint256 _amount, address _tokenAddress) external {
        require(tokenIndex[_tokenAddress] != 0, "This token isn't whitelisted.");
        uint256 index = tokenIndex[_tokenAddress] - 1;
        require(
            IERC20(tokens[index]).transferFrom(msg.sender, address(this), _amount),
            "Transfer failed."
        );

        emit FundsAdded(
            _amount,
            tokens[index],
            IERC20(tokens[index]).balanceOf(address(this))
        );
    }

    function withdrawFunds(address _tokenAddress) external onlyOwner {
        require(tokenIndex[_tokenAddress] != 0, "The contract doesn't have this token in balance.");
        uint256 index = tokenIndex[_tokenAddress] - 1;
        uint256 contractBalance = IERC20(tokens[index]).balanceOf(address(this));
        require(
            IERC20(tokens[index]).transfer(msg.sender, contractBalance),
            "Transfer failed."
        );
        emit FundsWithdrawn(tokens[index], contractBalance);
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
            IERC20(tokens[0]).transfer(msg.sender, subsidyClaimableAmount),
            "Not enough funds."
        );
        emit SubsidyClaimed(
            msg.sender,
            subsidyClaimableAmount,
            IERC20(tokens[0]).balanceOf(address(this))
        );
    }

    function getWhitelistedTokens() public view returns (address[] memory) {
        return tokens;
    }

    function isBeneficiary(
        address _beneficiaryAddress
    ) public view returns (bool) {
        return addressToUser[_beneficiaryAddress].lastClaimed != 0;
    }
}
