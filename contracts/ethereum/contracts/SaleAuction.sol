pragma solidity ^0.5.0;

import "./AuctionBase.sol";

contract SaleAuction is AuctionBase {

    constructor (address _nftAddress) public AuctionBase(_nftAddress) {}

    // @notice create auction to sale of ghost.
    //  There is a person to buy ghost.
    // @param _tokenId - Ghost ID to put on auction.
    // @param _seller - owner of Ghost ID
    // @param _buyer - address of person to buy ghost.
    // @param _amount - offered price of ghost.
    // @dev Message sender of this function owns _tokenId.
    function createAuction(uint256 _tokenId, address payable _seller, address payable _buyer, uint256 _amount) external {
        require(!_isOnAuction(_tokenId));
        require(msg.sender == address(nonFungibleContract));

        _escrow(_seller, _tokenId);

        Auction memory auction = Auction({
            seller: _seller,
            winner: _buyer,
            maxPrice: uint128(_amount),
            //sumPrice: uint256(0),
            duration: uint64(0),
            startedAt: uint64(now)
            });

        _addAuction(_tokenId, auction);
    }

    // @notice bids on sale auction.
    //  This function just transfer ghost to given person.
    //  Buyer has to pay fee.
    function bid(uint256 _tokenId) external payable {
        Auction storage auction = tokenIdToAuction[_tokenId];

        require(auction.winner == msg.sender);

        // TODO: setting bidding fee
        // TODO: send ether (max price of auction) to owner from buyer

        _transfer(auction.winner, _tokenId);
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

    // @notice returns bid amount of bidder(Message sender of this function).
    function getAuction(uint256 _tokenId) external view returns (address, address, uint256, uint256, uint256) {
        require(_isOnAuction(_tokenId));

        Auction storage auction = tokenIdToAuction[_tokenId];

        return (auction.seller, auction.winner, auction.maxPrice, auction.duration, auction.startedAt);
    }
}
