pragma solidity ^0.5.0;

import "./AuctionBase.sol";

contract SpecialAuction is AuctionBase {

    constructor (address _nftAddress) public AuctionBase(_nftAddress) {}

    // @notice create auction to sale special egg of ghost by CEO.
    // @param _tokenId - Ghost ID to put on auction.
    // @param _seller - Ghost ID of owner.
    // @param _duration - duration of auction.
    function createAuction(uint256 _tokenId, address payable _seller, uint256 _duration) external {
        require(_duration == uint256(uint64(_duration)));
        require(!_isOnAuction(_tokenId));
        require(_duration >= uint256(2 seconds));
        require(msg.sender == address(nonFungibleContract));

        _escrow(_seller, _tokenId);

        Auction memory auction = Auction({
            seller: _seller,
            winner: address(0),
            maxPrice: uint128(0),
            // sumPrice: uint256(0),
            duration: uint64(_duration),
            startedAt: uint64(now)
            });
        _addAuction(_tokenId, auction);
    }

    // @notice bids on special auction.
    // @param _tokenId - auctioned Ghost ID
    // @param _bidAmount - amount which bidder bid\
    function bid(uint256 _tokenId, uint256 _bidAmount) external payable {
        require(_bidAmount == uint256(uint128(_bidAmount)));
        require(_bidAmount > 0);

        Auction storage auction = tokenIdToAuction[_tokenId];

        require(auction.seller != msg.sender);

        // TODO: setting bidding fee
        _bid(_tokenId, msg.sender, _bidAmount);
    }

    // @notice cancel ongoing auction.
    // @param _tokenId - auctioned Ghost ID in auction to cancel.
    // @dev This function is just called by seller registered on the auction.
    function cancelAuction(uint256 _tokenId) external {
        require(_isOnAuction(_tokenId));

        Auction storage auction = tokenIdToAuction[_tokenId];
        require(msg.sender == auction.seller);

        _cancelAuction(_tokenId);
    }

    // @notice returns information of ongoing auction.
    function getAuction(uint256 _tokenId) external view returns (address, address, uint256, uint256, uint256) {
        require(_isOnAuction(_tokenId));

        Auction storage auction = tokenIdToAuction[_tokenId];

        return (auction.seller, auction.winner, auction.maxPrice, auction.duration, auction.startedAt);
    }

    // @notice returns bid amount of bidder(Message sender of this function)
    function getAmount(uint256 _tokenId) external view returns (uint256) {
        require(_isOnAuction(_tokenId));
        require(tokenIdToBidderAndAmount[_tokenId][msg.sender] != 0);

        return uint256(tokenIdToBidderAndAmount[_tokenId][msg.sender]);
    }

    // @notice returns the number of bidders participating in ongoing auction.
    function getNumBidders(uint256 _tokenId) external view returns (uint256) {
        require(_isOnAuction(_tokenId));

        return tokenIdToBidders[_tokenId].length;
    }

    // TODO: send ether to owner from winner.
    // @notice Finish auction.
    //  transfer ghost to winner, and winner sends ether to seller.
    // @dev Auction must be finished.
    function endAuction(uint256 _tokenId) external payable {
        require(_isOnAuction(_tokenId));

        _endAuction(_tokenId);
    }
}
