pragma solidity ^0.5.0;

import "./GhostOwnership.sol";

contract AuctionBase {

    // @notice The ERC-165 interface signature for ERC-721.
    bytes4 constant InterfaceSignature_ERC721 = bytes4(0x9f40b779);
    ERC721 public nonFungibleContract;

    constructor (address _nftAddress) public {
        ERC721 candidateContract = ERC721(_nftAddress);
        require(candidateContract.supportsInterface(InterfaceSignature_ERC721));
        nonFungibleContract = candidateContract;
    }

    struct Auction {
        // creator who this auction create.
        address payable seller;

        // current the most bid person and price (in wei) that this person bidding.
        address payable winner;
        uint256 maxPrice;

        //uint256 sumPrice;

        // Duration (in seconds) of auction
        uint64 duration;

        // Time when auction started
        uint64 startedAt;
    }

    // TODO: setting minimum auctioneer and bid price
    //uint16 constant minAuctioneer = 0;
    //uint128 constant minPrice = 0;

    // mapping from token ID(ghost ID) to Auction.
    mapping (uint256 => Auction) public tokenIdToAuction;

    // mapping from token ID(ghost ID) to bidders and amounts.
    // allocate one more mapping to calculate the number of bidders who participating in auction.
    mapping (uint256 => mapping (address => uint256)) tokenIdToBidderAndAmount;
    mapping (uint256 => address[]) tokenIdToBidders;

    event AuctionCreated(uint256 gene, uint256 duration, uint256 auctionType);
    event AuctionSuccessful(uint256 gene, uint256 maxPrice, address payable winner);
    event AuctionCancelled(uint256 gene);

    event BidderCreated(uint256 gene, address payable bidder, uint256 newAmount);
    event BidAmountUpdated(uint256 gene, address payable bidder, uint256 newAmount);

    // @notice Returns true if given address owns the token.
    function _owns(address _owner, uint256 _tokenId) internal view returns (bool) {
        return nonFungibleContract.ownerOf(_tokenId) == _owner;
    }

    // @notice Escrows the NFT, assigning ownership to this contract.
    // @param _owner - Current owner address of token to escrow.
    // @param _tokenId - ID of token whose approval to verify.
    function _escrow(address _owner, uint256 _tokenId) internal {
        nonFungibleContract.transferFrom(_owner, address(this), _tokenId);
    }

    // @notice Transfers an NFT owned by this contract to another address.
    function _transfer(address _to, uint256 _tokenId) internal {
        nonFungibleContract.transfer(_to, _tokenId);
    }

    // @notice Adds an auction to the list of auctions.
    // @param _tokenId - Ghost ID to put on auction.
    function _addAuction(uint256 _tokenId, Auction memory _auction, uint256 _auctionType) internal {
        tokenIdToAuction[_tokenId] = _auction;

        uint256 gene = nonFungibleContract.getGene(_tokenId);

        emit AuctionCreated(gene, uint256(_auction.duration), _auctionType);
    }

    // @notice removes an auction from the list of auctions.
    // @param _tokenId - auctioned Ghost ID.
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];

        uint256 idx;
        for (idx = 0; idx < tokenIdToBidders[_tokenId].length; idx++) {
            delete tokenIdToBidderAndAmount[_tokenId][tokenIdToBidders[_tokenId][idx]];
        }

        delete tokenIdToBidders[_tokenId];
    }

    // @notice cancel ongoing auction.
    // @param _tokenId - Ghost ID in auction to cancel.
    function _cancelAuction(uint256 _tokenId) internal {
        _transfer(tokenIdToAuction[_tokenId].seller, _tokenId);
        _removeAuction(_tokenId);
        uint256 gene = nonFungibleContract.getGene(_tokenId);
        emit AuctionCancelled(gene);
    }

    // @notice check if auction is ongoing.
    function _isOnAuction(uint256 _tokenId) internal view returns (bool) {
        Auction storage auction = tokenIdToAuction[_tokenId];

        return auction.startedAt > 0;
    }

    // @notice bidder who have not participated participates in the ongoing auction.
    // @param _tokenId - auctioned Ghost ID.
    // @dev when bidder has not yet bid
    function _addBidder(uint256 _tokenId, address payable _bidder, uint256 _bidAmount) internal {
        require(tokenIdToBidderAndAmount[_tokenId][_bidder] == uint256(0));

        Auction storage auction = tokenIdToAuction[_tokenId];

        require(auction.maxPrice < _bidAmount);

        tokenIdToBidderAndAmount[_tokenId][_bidder] = _bidAmount;
        tokenIdToBidders[_tokenId].push(_bidder);

        auction.winner = _bidder;
        auction.maxPrice = _bidAmount;

        uint256 gene = nonFungibleContract.getGene(_tokenId);

        emit BidderCreated(gene, _bidder, _bidAmount);
    }

    // @notice amount of bidder who have participated updates.
    // @param _tokenId - auctioned Ghost ID.
    // @dev when bidder has been bid
    function _updateBidAmount(uint256 _tokenId, address payable _bidder, uint256 _bidAmount) internal {
        require(tokenIdToBidderAndAmount[_tokenId][_bidder] != uint256(0));

        Auction storage auction = tokenIdToAuction[_tokenId];

        require(auction.maxPrice < _bidAmount);
        require(auction.winner != _bidder);

        tokenIdToBidderAndAmount[_tokenId][_bidder] = _bidAmount;
        //auction.sumPrice += _bidAmount;

        auction.winner = _bidder;
        auction.maxPrice = _bidAmount;

        uint256 gene = nonFungibleContract.getGene(_tokenId);

        emit BidAmountUpdated(gene, _bidder, _bidAmount);
    }

    // @notice check if the auction is finished by checking startedAt and duration of auction.
    function _isFinished(uint256 _tokenId) internal view returns (bool) {
        uint256 passedSeconds = 0;

        if (now > tokenIdToAuction[_tokenId].startedAt) {
            passedSeconds = now - tokenIdToAuction[_tokenId].startedAt;
        }

        if (passedSeconds >= tokenIdToAuction[_tokenId].duration){
            return true;
        }

        return false;
    }

    // @notice bids on special auction.
    // @dev Auction should be ongoing.
    function _bid(uint256 _tokenId, address payable _bidder, uint256 _bidAmount) internal {
        require(_isOnAuction(_tokenId));
        require(!_isFinished(_tokenId));

        //require(tokenIdToBidders[_tokenId].length >= minAuctioneer);
        require(_bidAmount > 0);

        if (tokenIdToBidderAndAmount[_tokenId][_bidder] == 0) {
            _addBidder(_tokenId, _bidder, _bidAmount);
        } else {
            _updateBidAmount(_tokenId, _bidder, _bidAmount);
        }
    }

    // @notice Finish auction.
    function _endAuction(uint256 _tokenId) internal {
        require(_isFinished(_tokenId));

        Auction storage auction = tokenIdToAuction[_tokenId];
        if (auction.winner != address(0)) {
            _transfer(auction.winner, _tokenId);

            uint256 gene = nonFungibleContract.getGene(_tokenId);

            emit AuctionSuccessful(gene, uint256(auction.maxPrice), auction.winner);
            _removeAuction(_tokenId);
        } else {
            _cancelAuction(_tokenId);
        }
    }
}
