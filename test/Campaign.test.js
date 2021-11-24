const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compliedFactory = require('../ethereum/build/CampaignFactory.json')
const compliedCampaign = require('../ethereum/build/Campaign.json')

let accounts;
let factory;
let campaign; //address of man want to create a campaign
let campaignAddress;//address of owner

beforeEach( async() => {
    accounts = await web3.eth.getAccounts()
    factory = await new web3.eth.Contract(JSON.parse(compliedFactory.interface))
        .deploy({ data: compliedFactory.bytecode })
        .send({ from: accounts[0] , gas: '1000000'});
    // await ham createCampaign
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    })
    //await getDeployedCampaigns to get all address of user join to create a new campaign
    const addresses = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = addresses[0] 
    campaign = await new web3.eth.Contract(JSON.parse(compliedCampaign.interface), campaignAddress)        
})
//test
describe('Campaigns' ,() => {
    it('deploys a factory or campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('marks caller as the campaign manager', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });
    it('marks the people contribue is approver', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '102'
        })
        const isContribute = await campaign.methods.approves(accounts[1]).call()
        assert.ok(isContribute);
    });
    it('require a minimum ether contributor', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '10',
                from: accounts[1]
            });
            assert(false)
        } catch (error) {
            assert(error)
        }
    });
    it('allow only manager can create a request', async () => {
        await campaign.methods.createRequest(
            'so beauti',
            '1000',
            accounts[2]
        ).send({
            from: accounts[0],
            gas: '1000000'
        })
        const request = await campaign.methods.requests(0).call();
        assert.equal('so beauti', request.description)
    });
    it('last test', async ()=> {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.createRequest(
            'A',
            web3.utils.toWei('5' ,'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether')
        balance = parseFloat(balance);
        console.log(balance)
        assert(balance > 15)
    })
})