pragma solidity ^0.5.0;

import "./AccessControl.sol";

contract GhostBase is AccessControl {

    event Transfer(address from, address to, uint256 gene);
    event Birth(address owner, uint256 tokenId, uint256 gene);
    event LevelUp(address owner, uint256 gene, uint256 level);
    event Approval(address from, address to, uint256 tokenId);

    constructor (address payable _ceoAddress) public AccessControl(_ceoAddress){}

    struct Ghost {
        // Ghosts have unique genetic code which is packed into 256-bits.
        uint64 gene;

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

        uint256 gene = ghosts[_tokenId].gene;
        delete ghostIndexToApproved[_tokenId];

        ownershipTokenCount[_from]--;

        emit Transfer(_from, _to, gene);
    }

    // @dev create egg that ghost with level 0.
    //  Given owner owns this egg.
    function _createEgg(uint64 _gene, address _owner) internal {
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
        uint256 gene = ghosts[_tokenId].gene;
        ghosts[_tokenId].level++;
        emit LevelUp(_owner, gene, ghosts[_tokenId].level);
    }

    function setLevelLimit(uint8 _levelLimit) external onlyCEO {
        require(_levelLimit > 0);

        levelLimit = uint8(_levelLimit);
    }
}
