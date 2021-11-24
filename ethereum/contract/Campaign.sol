pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployCampaigns;
    function createCampaign(uint minimum) public {  
        address newCampaign = new Campaign(minimum, msg.sender);
        deployCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns (address[]) {
        return deployCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping( address => bool ) approvals;
    }
    Request[] public requests;
    address public manager;
    mapping( address => bool ) public approves;
    uint public minimumContribution;
    uint public approverCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approves[msg.sender] = true;
        approverCount++;
    }
    function createRequest(string  description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approves[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    function finalizeRequest(uint index) public {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approverCount / 2));
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approverCount,
            manager
        );
    }
    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}