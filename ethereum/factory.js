import web3 from "./web3";
import CampaignFactory from '../ethereum/build/CampaignFactory.json'

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0x18632E47052dd09836519dc77842ddfEcd614b29');  


export default instance;