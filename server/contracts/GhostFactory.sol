pragma solidity ^0.5.0;

import "./GhostOwnership.sol";

contract GhostFactory is GhostOwnership {

    using ECDSA for bytes32;

    // TODO: setting fee to need to level up.
    uint levelUpFee = 0 ether;

    // @dev create egg that ghost with level 0.
    //  Must manage ghost ownership.
    // @param _gene - Gene of ghost to be generated.
    // @param _owner - The address of owner of ghost to be generated.
    // @param _signature - Signature to verify creation permisson.
    function createEgg(uint256 _gene, address _owner, bytes _signature) external {
        require(_gene != uint256(0));
        require(_owner != address(0));

        bytes32 hash = keccak256(abi.encodePacked(_gene, _owner));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        // TODO: Is the signer the owner?
        require(signer == _owner);

        uint256 tokenId = _createEgg(_gene, _owner);

        ghostIndexToOwner[tokenId] = _owner;
        ownershipTokenCount[tokenId]++;
    }

    // TODO: calculate ratio of angel and devil.
    // @dev returns ratio of angel and devil.
    function getGauge() public view returns (uint, uint) {
        return (0, 0);
    }

    // @dev increase level of ghost.
    // @param _tokenId - Ghost ID to level up.
    // @param _signature - Signature to verify level up permisson.
    function levelUp(uint256 _tokenId, bytes _signature) external payable {
        require(msg.value == levelUpFee);

        bytes32 hash = keccak256(abi.encodePacked(_tokenId));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        // TODO: Is the signer the owner?
        require(signer == ownerOf(_tokenId));

        _levelUp(_tokenId);
    }
}