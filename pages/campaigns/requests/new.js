import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import { Router } from "../../../routes";
import { Button, Form, Message } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign"
import web3 from "../../../ethereum/web3";

class New extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    return { address };
  }
  state = {
      value: '',
      description: '',
      recipient: '',
      loading: false,
      errorMsg : ''
  }
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    // <=> description = this.props.description, ....
    const { description, value, recipient} = this.state;
    this.setState({ loading: true})
    try {        
        await campaign.methods.createRequest(
            description,
            web3.utils.toWei(value, 'ether'),
            recipient)
            .send({
            from: accounts[0]
        });
        this.setState({ loading: false, errorMsg: ''})
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (error) {
        this.setState({ loading: false , errorMsg: error.message })
    }
  }
  render() {
    return (
      <Layout>        
        <Link route={`/campaigns/${this.props.address}/requests`}>
            <a>BACK</a>
        </Link>
        <h3>Create a Request!</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
          <Form.Field>
            <label>Description</label>
            <input 
                value = {this.state.description}
                onChange = {event => this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in ether</label>
            <input 
                value = {this.state.value}
                onChange = {event => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <input 
                value = {this.state.recipient}
                onChange = {event => this.setState({ recipient: event.target.value })}
            />
          </Form.Field>
          <Message error header="Oops?" content={this.state.errorMsg}/>
          <Button loading ={this.state.loading} color="green">Create!</Button>
        </Form>
      </Layout>
    );
  }
}
export default New;
