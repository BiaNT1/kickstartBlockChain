import React, { Component } from "react";
import { Button, Header, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes"
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";
class requestHome extends Component {
    static async getInitialProps (props) {
        const address = props.query.address;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const Summary = await campaign.methods.getSummary().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );        
        console.log(Summary);
        return {address, requests, requestCount, approver: Summary[3]};
    }
    renderRow(){
        return this.props.requests.map((request,index) => {
            return(
                <RequestRow
                    key={index}
                    id= {index+1}
                    request={request}
                    address={this.props.address}
                    approver={this.props.approver}
                />                
            )
        })
    }
    render(){
        return(
            <Layout>
                <h3>Requests</h3>
                <Link route ={`/campaigns/${this.props.address}/requests/new`} >
                    <Button floated="right" style={{ marginBottom: '10px'}}>Create Request</Button>
                </Link>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amout</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRow()}
                    </Table.Body>
                </Table>
                <h3>{`Found ${this.props.requests.length} requests`}</h3>
            </Layout>
        )
    };
}

export default requestHome;