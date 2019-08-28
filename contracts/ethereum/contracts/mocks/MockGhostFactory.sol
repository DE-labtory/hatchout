pragma solidity ^0.5.0;

import "../GhostFactory.sol";

contract MockGhostFactory is GhostFactory {

    constructor (address payable _ceoAddress) public GhostFactory(_ceoAddress){}

    function getLevelOfGhost(uint256 _tokenId) external view returns (uint8) {
        return ghosts[_tokenId].level;
    }

    function getSignature(uint256 _tokenId, bytes calldata _signature) external view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(_tokenId, ghosts[_tokenId].level));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);

        return signer;
    }
}
