// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
  mapping(address => bool) private funders;
  mapping(uint256 => address) private lutFunders;
  uint256 public numberOfFunders;
  uint256 public withdrawLimit;

  constructor() {
    setWithdrawLimit(100000000000000000);
  }

  error MaxWithdrawAmount(uint256 asked, uint256 max);

  modifier limitWithdraw(uint256 amount) {
    if (amount > withdrawLimit) {
      revert MaxWithdrawAmount(amount, withdrawLimit);
    }
    _;
  }

  receive() external payable {}

  function emitLog() public pure override returns (bytes32) {
    return "hello world";
  }

  function getWithdrawLimit() public view returns (uint256) {
    return withdrawLimit;
  }

  function setWithdrawLimit(uint256 newLimit) public onlyOwner {
    withdrawLimit = newLimit;
  }

  function getFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numberOfFunders);
    for (uint256 i = 0; i < numberOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }
    return _funders;
  }

  function getFunderAtIndex(uint256 index) external view returns (address) {
    return lutFunders[index];
  }

  function addFunds() external payable override {
    address funder = msg.sender;
    if (!funders[funder]) {
      uint256 index = numberOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }

  function withdraw(uint256 amount) external override limitWithdraw(amount) {
    payable(msg.sender).transfer(amount);
  }
}

// const instance = await Faucet.deployed();

// instance.addFunds({from: accounts[0], value: "2000000000000000000"})
// instance.addFunds({from: accounts[1], value: "2000000000000000000"})

// instance.withdraw("500000000000000000", {from: accounts[1]})

// instance.getFunderAtIndex(0)
// instance.getAllFunders()
