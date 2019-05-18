pragma solidity ^0.5.0;

import "./ERC721.sol";
import "./AuctionBase.sol";
import "./AccessControl.sol";

contract SpecialAuction is AuctionBase,  AccessControl{

    constructor (address _nftAddress) public AuctionBase(_nftAddress) {}

    // @dev create auction to sale special egg of ghost by CEO.
    // @param _tokenId - Ghost ID to put on auction.
    // @param _duration - duration of auction.
    // @notice Message sender of this function owns _tokenId.
    function createAuction(uint256 _tokenId, uint256 _duration) external onlyCEO {
        require(_duration == uint256(uint64(_duration)));
        require(!_isOnAuction(_tokenId));

        require(_owns(msg.sender, _tokenId));
        _escrow(msg.sender, _tokenId);
        // TODO: set start price (max price)
        Auction memory auction = Auction({
            seller: msg.sender,
            winner: address(0),
            maxPrice: uint128(0),
            sumPrice: uint256(0),
            duration: uint64(_duration),
            startedAt: uint64(now)
            });
        _addAuction(_tokenId, auction);
    }

    // TODO: implement send ether of bidder to seller
    // @dev bids on special auction.
    // @param _tokenId - auctioned Ghost ID
    // @notice Message sender of this function is bidder.
    function bid(uint256 _tokenId) external payable {
        require(msg.sender == address(nonFungibleContract));
        require(!_isFinished(_tokenId));

        // TODO: setting bidding fee
        _bid(_tokenId, msg.sender, msg.value);
    }

    // @dev cancel ongoing auction.
    // @param _tokenId - auctioned Ghost ID in auction to cancel.
    // @notice This function is just called by seller registered on the auction.
    function cancelAuction(uint256 _tokenId) external {
        Auction storage auction = tokenIdAuction[_tokenId];
        require(_isOnAuction(auction));
        require(msg.sender == auction.seller);

        _cancelAuction(_tokenId);
    }

    // @dev returns information of ongoing auction.
    function getAuction(uint256 _tokenId) external view returns (address, address, uint256, uint256, uint256, uint256) {

        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));

        return (auction.seller, auction.winner, auction.maxPrice, auction.sumPrice, auction.duration, auction.startedAt);
    }

    // @dev returns bid amount of bidder(Message sender of this function)
    function getAmount(uint256 _tokenId) external view returns (uint256) {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));

        require(tokenIdToBidderAndAmount[_tokenId][msg.sender] != 0);

        return tokenIdToBidderAndAmount[_tokenId][msg.sender];
    }

    // @dev returns the number of bidders participating in ongoing auction.
    function getNumBidders(uint256 _tokenId) external view returns (uint256) {
        require(_isOnAuction(tokenIdToAuction[_tokenId]));

        return tokenIdToBidders[_tokenId].length;
    }

    // @dev check if the auction is finished by checking startedAt and duration of auction.
    function isFinished(uint256 _tokenId) external returns (bool) {
        return _isFinished(_tokenId);
    }

    // TODO: send ether to winner
    // @dev Finish auction.
    //  transfer ghost to winner, and winner sends ether to seller.
    // @notice Auction must be finished.
    function endAuction(uint256 _tokenId) external payable {
        require(_isFinished(_tokenId));

        Auction storage auction = tokenIdToAuction[_tokenId];



        _transfer(auction.winner, _tokenId);
        emit AuctionSuccessful(_tokenId, auction.sumPrice, auction.winner);

        _removeAuction(_tokenId);
    }
}
