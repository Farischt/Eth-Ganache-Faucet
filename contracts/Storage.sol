// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {
  // keccak256(key . slot)
  mapping(uint256 => uint256) public aa; // slot 0
  mapping(address => uint256) public bb; // slot 1

  // toHex(toDecimale(keccak256(slot) + index of the item))
  uint256[] public cc; // slot 2

  uint8 public a = 7; // 1 byte
  uint16 public b = 10; // 2bytes
  address public c = 0x648FaaD551af1DA6d6556f0E3C41B37B6055bAD1; // 20bytes
  bool d = true; // 1 byte
  uint64 public e = 15; // 8bytes
  // 32 bytes, all values will be stored in slot 2

  // 0x 0f 01 648faad551af1da6d6556f0e3c41b37b6055bad1 000a 07

  uint256 public f = 200; // 32bytes -> slot 3

  uint8 public g = 40; // 1byte -> slot 4

  uint256 public h = 789; // 32bytes -> slot 5

  constructor() {
    cc.push(12);
    cc.push(20);
    aa[2] = 4;
    aa[3] = 10;
    bb[0xf8929048D74164582E5FA0897fC654CbF0c096C6] = 100;
  }
}

// 0x000000000000000000000000f8929048D74164582E5FA0897fC654CbF0c096C60000000000000000000000000000000000000000000000000000000000000001

// 000000000000000000000000f8929048D74164582E5FA0897fC654CbF0c096C6
// 0000000000000000000000000000000000000000000000000000000000000002
