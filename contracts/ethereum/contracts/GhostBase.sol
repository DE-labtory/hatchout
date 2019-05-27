pragma solidity ^0.5.0;

import "./AccessControl.sol";

contract GhostBase is AccessControl {

    event Transfer(address from, address to, uint256 tokenId);
    event Birth(address owner, uint256 tokenId, uint256 gene);
    event LevelUp(address owner, uint256 tokenId, uint256 level);
    event Approval(address from, address to, uint256 tokenId);

    constructor (address _ceoAddress) public AccessControl(_ceoAddress){}

    struct Ghost {
        // Ghosts have unique genetic code which is packed into 256-bits.
        uint256 gene;

        // timestamp when ghost is born.
        uint64 birthTime;

        // Ghost's level. This is related to ghost's appearance.
        // level = 0 : egg
        // level > 0 : hatched egg
        uint8 level;
    }

    // An array containing ghosts that exist. Index of this array is used as ghostId.
    Ghost[] ghosts;

    // mapping from ghostId to address of owner.
    mapping (uint256 => address) public ghostIndexToOwner;

    // mapping from ghostId to address that has been approved to call transferfrom().
    mapping (uint256 => address) public ghostIndexToApproved;

    // mapping from address of owner to the number of tokens owned by owner.
    mapping (address => uint256) ownershipTokenCount;

    uint8 levelLimit = 3;

    // @dev Assigning ownership of ghost from _from to _to.
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0));

        ownershipTokenCount[_to]++;
        ghostIndexToOwner[_tokenId] = _to;
        delete ghostIndexToApproved[_tokenId];

        ownershipTokenCount[_from]--;

        emit Transfer(_from, _to, _tokenId);
    }

    // @dev create egg that ghost with level 0.
    //  Given owner owns this egg.
    function _createEgg(uint256 _gene, address _owner) internal {
        Ghost memory _ghost = Ghost({
            gene: _gene,
            birthTime: uint64(now),
            level: 0
        });

        uint256 newGhostId = ghosts.push(_ghost) - 1;
        ghostIndexToOwner[newGhostId] = _owner;
        ownershipTokenCount[_owner]++;
        emit Birth(_owner, newGhostId, _ghost.gene);
    }

    // @dev increase level of ghost.
    function _levelUp(address _owner, uint256 _tokenId) internal {

        // TODO: setting limit of level
        require(ghosts[_tokenId].level < levelLimit);
        ghosts[_tokenId].level++;
        emit LevelUp(_owner, _tokenId, ghosts[_tokenId].level);
    }

    function setLevelLimit(uint256 _levelLimit) external onlyCEO {
        require(_levelLimit > uint256(0));
        require(_levelLimit == uint256(uint8(_levelLimit)));

        levelLimit = uint8(_levelLimit);
    }
}
