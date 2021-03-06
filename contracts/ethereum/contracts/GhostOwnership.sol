pragma solidity ^0.5.0;

import "./GhostBase.sol";
import "./ERC721.sol";

contract GhostOwnership is GhostBase, ERC721 {
    string public constant name = "ghost";
    string public constant symbol = "GH";

    bytes4 constant InterfaceSignature_ERC165 =
    bytes4(keccak256('supportsInterface(bytes4)'));

    bytes4 constant InterfaceSignature_ERC721 =
    bytes4(keccak256('name()')) ^
    bytes4(keccak256('symbol()')) ^
    bytes4(keccak256('totalSupply()')) ^
    bytes4(keccak256('balanceOf(address)')) ^
    bytes4(keccak256('ownerOf(uint256)')) ^
    bytes4(keccak256('approve(address,uint256)')) ^
    bytes4(keccak256('transfer(address,uint256)')) ^
    bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    bytes4(keccak256('tokensOfOwner(address)'));

    constructor (address payable _ceoAddress) public GhostBase(_ceoAddress){}

    /// @dev Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
    ///  Returns true for any standardized interfaces implemented by this contract. We implement
    ///  ERC-165 (obviously!) and ERC-721.
    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }

    // @dev check if the owner owns ghostId
    function _owns(address _owner, uint256 _tokenId) internal view returns (bool) {
        return ghostIndexToOwner[_tokenId] == _owner;
    }

    // @dev return the number of tokens that owner currently owns
    function balanceOf(address _owner) public view returns (uint256) {
        return ownershipTokenCount[_owner];
    }

    // @dev check if a given address currently has approval for ghost.
    function _approvedFor(address _approved, uint256 _tokenId) internal view returns (bool) {
        return ghostIndexToApproved[_tokenId] == _approved;
    }

    // @dev give approve authority to given address.
    function _approve(address _approved, uint256 _tokenId) internal {
        ghostIndexToApproved[_tokenId] = _approved;
    }

    // @dev transfer ghostId to given address. given address must be different with present owner.
    function transfer(address _to, uint256 _tokenId) external {
        require(_to != msg.sender);
        require(_to != address(0));
        require(_owns(msg.sender, _tokenId));

        _transfer(msg.sender, _to, _tokenId);
    }

    // @dev give authority that transfer ghost to another address via transferFrom().
    function approve(address _to, uint256 _tokenId) external {
        require(_owns(msg.sender, _tokenId));
        require(_to != address(0));

        _approve(_to, _tokenId);

        emit Approval(msg.sender, _to, _tokenId);
    }

    // @dev A sender with approval authority assigns from _from to _to.
    function transferFrom(address _from, address _to, uint256 _tokenId) external {
        require(_from != address(0));
        require(_to != address(0));
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        _transfer(_from, _to, _tokenId);
    }

    // @dev return the total number of ghosts currently in existence.
    function totalSupply() public view returns (uint) {
        return ghosts.length - 1;
    }

    // @dev return address of owner that currently owns given ghostId.
    function ownerOf(uint256 _tokenId) external view returns (address) {
        require(ghostIndexToOwner[_tokenId] != address(0));

        return ghostIndexToOwner[_tokenId];
    }

    // @dev return ghostId that given address of owner currently owns.
    function tokensOfOwner(address _owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        }

        uint256[] memory result = new uint256[](tokenCount);
        uint256 totalGhosts = totalSupply();
        uint256 resultIndex = 0;

        uint256 ghostId;

        for (ghostId = 1; ghostId <= totalGhosts; ghostId++){
            if (_owns(_owner, ghostId)) {
                result[resultIndex] = ghostId;
                resultIndex++;
            }
        }

        return result;
    }

    function getGene(uint256 _tokenId) public view returns (uint256) {
        return ghosts[_tokenId].gene;
    }
}
