pragma solidity ^0.5.0;

import "../GhostFactory.sol";

contract MockGhostFactory is GhostFactory {

    constructor (address _ceoAddress) public GhostFactory(_ceoAddress){}

    function getLevelOfGhost(uint256 _tokenId) external view returns (uint256) {
        return uint256(ghosts[_tokenId].level);
    }
}
