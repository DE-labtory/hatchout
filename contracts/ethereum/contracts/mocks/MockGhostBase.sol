pragma solidity ^0.5.0;

import "../GhostBase.sol";

contract MockGhostBase is GhostBase {

    constructor (address _ceoAddress) public GhostBase(_ceoAddress){}

    function transfer(address _from, address _to, uint256 _tokenId) external {
        _transfer(_from, _to, _tokenId);
    }

    function createEgg(uint256 _gene, address _owner) external {
        _createEgg(_gene, _owner);
    }

    function levelUp(address _owner, uint256 _tokenId) external {
        _levelUp(_owner, _tokenId);
    }

    function owns(address _owner, uint256 _tokenId) external view returns (bool) {
        return ghostIndexToOwner[_tokenId] == _owner;
    }

    function getLevelLimit() external view returns (uint256) {
        return levelLimit;
    }

    function getLevelOfGhost(uint256 _tokenId) external view returns (uint256) {
        return uint256(ghosts[_tokenId].level);
    }
}
