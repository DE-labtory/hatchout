pragma solidity ^0.5.0;

import "./GhostOwnership.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract GhostFactory is GhostOwnership {

    using ECDSA for bytes32;

    mapping (bytes => bool) createSignatures;
    mapping (bytes => bool) levelSignatures;

    constructor (address payable _ceoAddress) public GhostOwnership(_ceoAddress){}

    // TODO: setting fee to need to level up.
    uint256 levelUpFee = 1 szabo;

    // @dev create egg that ghost with level 0.
    //  Must manage ghost ownership.
    // @param _gene - Gene of ghost to be generated.
    // @param _signature - Signature to verify creation permission.
    function createEgg(uint256 _gene, bytes calldata _signature) external {
        require(_gene != 0);
        require(_gene == uint256(uint64(_gene)));
        require(!createSignatures[_signature]);

        bytes32 hash = keccak256(abi.encodePacked(_gene));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        require(signer == ceoAddress);

        createSignatures[_signature] = true;
        _createEgg(uint64(_gene), msg.sender);
    }

    // TODO: send fee to ceo.
    // @dev increase level of ghost.
    // @param _tokenId - Ghost ID to level up.
    // @param _signature - Signature to verify level up permission.
    function levelUp(uint256 _tokenId, bytes calldata _signature) external payable {
        require(msg.value >= levelUpFee);
        require(_owns(msg.sender, _tokenId));
        require(!levelSignatures[_signature]);

        uint256 level = ghosts[_tokenId].level;
        bytes32 hash = keccak256(abi.encodePacked(_tokenId, level));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        require(signer == ceoAddress);

        uint256 fee = msg.value;

        if (fee > levelUpFee) {
            uint256 proceeds = fee - levelUpFee;

            msg.sender.transfer(proceeds);
        }

        ceoAddress.transfer(levelUpFee);

        levelSignatures[_signature] = true;
        _levelUp(msg.sender, _tokenId);
    }
}