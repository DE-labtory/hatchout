pragma solidity ^0.5.0;

contract AccessControl {
    address public ceoAddress;

    constructor (address _ceoAddress) public {
        ceoAddress = _ceoAddress;
    }

    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    function setCEO(address _newCEO) external onlyCEO {
        require(_newCEO != address(0));

        ceoAddress = _newCEO;
    }
}
