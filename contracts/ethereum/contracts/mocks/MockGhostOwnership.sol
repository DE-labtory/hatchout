pragma solidity ^0.5.0;

import "../GhostOwnership.sol";

contract MockGhostOwnership is GhostOwnership {

    constructor (address payable _ceoAddress) public GhostOwnership(_ceoAddress){}

    function createEgg(uint64 _gene, address _owner) external {
        _createEgg(_gene, _owner);
    }

    function owns(address _owner, uint256 _tokenId) external view returns (bool) {
        return _owns(_owner, _tokenId);
    }

    function approvedFor(address _approved, uint256 _tokenId) external view returns (bool) {
        return _approvedFor(_approved, _tokenId);
    }
}
