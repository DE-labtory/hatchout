pragma solidity ^0.5.0;

import "../GhostFactory.sol";

contract MockGhostFactory is GhostFactory {

    constructor (address payable _ceoAddress) public GhostFactory(_ceoAddress){}

    function getLevelOfGhost(uint256 _tokenId) external view returns (uint8) {
        return ghosts[_tokenId].level;
    }
}
