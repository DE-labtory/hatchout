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
    // @param _owner - The address of owner of ghost to be generated.
    // @param _signature - Signature to verify creation permisson.
    function createEgg(uint256 _gene, address _owner, bytes calldata _signature) external {
        require(_gene != 0);
        require(_gene == uint256(uint64(_gene)));
        require(_owner != address(0));
        require(!createSignatures[_signature]);

        bytes32 hash = keccak256(abi.encodePacked(_gene, _owner));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        require(signer == _owner);

        createSignatures[_signature] = true;
        _createEgg(uint64(_gene), _owner);
    }

    // TODO: send fee to ceo.
    // @dev increase level of ghost.
    // @param _owner - owner who has ghost ID
    // @param _tokenId - Ghost ID to level up.
    // @param _signature - Signature to verify level up permisson.
    function levelUp(address payable _owner, uint256 _tokenId, bytes calldata _signature) external payable {
        require(msg.value >= levelUpFee);
        require(_owner != address(0));
        require(_owns(_owner, _tokenId));
        require(!levelSignatures[_signature]);

        uint256 level = ghosts[_tokenId].level;
        bytes32 hash = keccak256(abi.encodePacked(_tokenId, level));
        bytes32 messageHash = hash.toEthSignedMessageHash();

        address signer = messageHash.recover(_signature);
        require(signer == _owner);

        uint256 fee = msg.value;

        if (fee > levelUpFee) {
            uint256 proceeds = fee - levelUpFee;

            _owner.transfer(proceeds);
        }

        ceoAddress.transfer(levelUpFee);

        levelSignatures[_signature] = true;
        _levelUp(_owner, _tokenId);
    }
}
