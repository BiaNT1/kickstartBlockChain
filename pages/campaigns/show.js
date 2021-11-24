import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class Show extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const Summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: Summary[0],
      balance: Summary[1],
      requestsCount: Summary[2],
      approversCount: Summary[3],
      manager: Summary[4],
    };
  }
  renderCards() {
    const {
      minimumContribution,
      balance,
      manager,
      approversCount,
      requestsCount,
    } = this.props;
    const items = [
      {
        header: manager,
        description: "The manager create this campaign!",
        meta: "Address of manager",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (Wei)",
        description: `You must contribute at least this much wei to ${minimumContribution}`,
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description: "A request try to withdraw money...",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ethere)",
        description: "The balance is how much money this campaign has left",
      },
    ];
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <h3>Campaign Show!!</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm floated="right" address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
          <Grid.Column>
          <Link route={`/campaigns/${this.props.address}/requests`}>
          <Button>View Requests</Button>
        </Link>
          </Grid.Column>
            
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default Show;
