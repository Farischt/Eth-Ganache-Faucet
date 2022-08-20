// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
  address public owner;
  error OnlyOwner();
  modifier onlyOwner() {
    if (msg.sender != owner) {
      revert OnlyOwner();
    }
    _;
  }

  constructor() {
    setOwner(msg.sender);
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function setOwner(address newOwner) public {
    owner = newOwner;
  }
}
