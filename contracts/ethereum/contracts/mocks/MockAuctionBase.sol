pragma solidity ^0.5.0;

import "../AuctionBase.sol";

contract MockAuctionBase is AuctionBase {

    constructor (address _nftAddress) public AuctionBase(_nftAddress){}

    function owns(address _owner, uint256 _tokenId) external view returns (bool) {
        return _owns(_owner, _tokenId);
    }

    function escrow(address _owner, uint256 _tokenId) external {
        _escrow(_owner, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) external {
        _transfer(_to, _tokenId);
    }

    function addAuction(uint256 _tokenId, uint256 _auctionType) external {
        Auction memory auction = Auction({
            seller: msg.sender,
            winner: address(0),
            maxPrice: uint256(0),
            //sumPrice: uint256(0),
            duration: uint64(2 seconds),
            startedAt: uint64(now)
            });

        _addAuction(_tokenId, auction, _auctionType);
    }

    function removeAuction(uint256 _tokenId) external {
        _removeAuction(_tokenId);
    }

    function cancelAuction(uint256 _tokenId) external {
        _cancelAuction(_tokenId);
    }

    function isOnAuction(uint256 _tokenId) external view returns (bool) {
        return _isOnAuction(_tokenId);
    }

    function addBidder(uint256 _tokenId, address payable _bidder, uint256 _bidAmount) external {
        _addBidder(_tokenId, _bidder, _bidAmount);
    }

    function isAddedBidder(uint256 _tokenId, address payable _bidder) external view returns (bool) {
        return tokenIdToBidderAndAmount[_tokenId][_bidder] != uint256(0);
    }

    function updateBidAmount(uint256 _tokenId, address payable _bidder, uint256 _bidAmount) external {
        _updateBidAmount(_tokenId, _bidder, _bidAmount);
    }

    function getBidderAmount(uint256 _tokenId, address payable _bidder) external view returns (uint256) {
        return tokenIdToBidderAndAmount[_tokenId][_bidder];
    }

    function bid(uint256 _tokenId, address payable _bidder, uint256 _bidAmount) external {
        _bid(_tokenId, _bidder, _bidAmount);
    }

    function isFinished(uint256 _tokenId) external view returns (bool) {
        return _isFinished(_tokenId);
    }

    function endAuction(uint256 _tokenId) external {
        _endAuction(_tokenId);
    }
}
