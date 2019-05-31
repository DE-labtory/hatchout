pragma solidity ^0.5.0;

import "../GhostOwnership.sol";
import "../SpecialAuction.sol";
import "../SaleAuction.sol";

contract MockAuctionCreator is GhostOwnership {
    // address of special auction that control sale of special ghost.
    SpecialAuction public specialAuction;

    // address of sale auction that control sale of ghost between users.
    SaleAuction public saleAuction;

    constructor (address _specialAddress, address _saleAddress) public GhostOwnership(msg.sender) {
        SpecialAuction candidateSpecialContract = SpecialAuction(_specialAddress);

        specialAuction = candidateSpecialContract;

        SaleAuction candidateSaleContract = SaleAuction(_saleAddress);

        saleAuction = candidateSaleContract;
    }

    function createSpecialAuction(uint256 _tokenId, address payable _seller, uint256 _duration) external {
        _approve(address(specialAuction), _tokenId);

        specialAuction.createAuction(_tokenId, _seller, _duration);
    }

    function createSaleAuction(uint256 _tokenId, address payable _seller, address payable _buyer, uint256 _amount) external {
        _approve(address(saleAuction), _tokenId);

        saleAuction.createAuction(_tokenId, _seller, _buyer, _amount);
    }

    function setSpecialAuctionAddress(address _contractAddress) external onlyCEO {
        SpecialAuction candidateContract = SpecialAuction(_contractAddress);

        specialAuction = candidateContract;
    }

    function setSaleAuctionAddress(address _contractAddress) external onlyCEO {
        SaleAuction candidateContract = SaleAuction(_contractAddress);

        saleAuction = candidateContract;
    }

    function createEgg(uint256 _gene, address _owner) external {
        _createEgg(_gene, _owner);
    }
}
