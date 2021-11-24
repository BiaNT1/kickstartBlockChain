import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
  onApprove = async () => {
    const Campaign = campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await Campaign.methods.approveRequest(this.props.id - 1).send({
      from: accounts[0],
    });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };
  onFinalize = async () => {
    const Campaign = campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await Campaign.methods.finalizeRequest(this.props.id - 1).send({
      from: accounts[0],
    });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };
  render() {
    const readyToFinal = this.props.request.approvalCount > this.props.approver / 2;
    return (
      <Table.Row positive ={readyToFinal} >
        <Table.Cell>{this.props.id}</Table.Cell>
        <Table.Cell>{this.props.request.description}</Table.Cell>
        <Table.Cell>
          {web3.utils.fromWei(this.props.request.value, "ether")}
        </Table.Cell>
        <Table.Cell>{this.props.request.recipient}</Table.Cell>
        <Table.Cell>{`${this.props.request.approvalCount}/${this.props.approver}`}</Table.Cell>
        <Table.Cell>
          {
            <Button color="green" onClick={this.onApprove}>
              Approve
            </Button>
          }
        </Table.Cell>
        <Table.Cell>
          {this.props.request.complete ? null : (
            <Button color="orange" onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  }
}
export default RequestRow;
