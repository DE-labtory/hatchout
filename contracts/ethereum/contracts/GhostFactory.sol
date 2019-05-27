pragma solidity ^0.5.0;

import "./GhostOwnership.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract GhostFactory is GhostOwnership {

    using ECDSA for bytes32;

    constructor (address _ceoAddress) public GhostOwnership(_ceoAddress){}

    // TODO: setting fee to need to level up.
    uint levelUpFee = 0 ether;

    // @dev create egg that ghost with level 0.
    //  Must manage ghost ownership.
    // @param _gene - Gene of ghost to be generated.
    // @param _owner - The address of owner of ghost to be generated.
    // @param _signature - Signature to verify creation permisson.
    function createEgg(uint256 _gene, address _owner, bytes calldata _signature) external {
        require(_gene != uint256(0));
        require(_owner != address(0));

        bytes32 hash = keccak256(abi.encodePacked(_gene, _owner));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        require(signer == _owner);

        _createEgg(_gene, _owner);
    }

    // TODO: send fee to ceo.
    // @dev increase level of ghost.
    // @param _owner - owner who has ghost ID
    // @param _tokenId - Ghost ID to level up.
    // @param _signature - Signature to verify level up permisson.
    function levelUp(address _owner, uint256 _tokenId, bytes calldata _signature) external {
        // require(msg.value == levelUpFee);
        require(_owner != address(0));
        require(_owns(_owner, _tokenId));

        bytes32 hash = keccak256(abi.encodePacked(_tokenId));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        require(signer == _owner);

        _levelUp(_owner, _tokenId);
    }
}