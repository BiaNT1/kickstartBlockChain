import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Form, Button, Input, Message, Icon } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from '../../routes'

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false
  };
  onSubmit = async (event) => {
    const accounts = await web3.eth.getAccounts();
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' })
    try {
      await Factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });  
        Router.pushRoute('/')
        this.setState({ loading: false })      
    } catch (error) {
      this.setState({ errorMessage: error.message, loading: false });
    }
  };
  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>MinumumContribution</label>
            <Input
              label="wei"
              placeholder="Here"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops?" content={this.state.errorMessage}/>
          <Button color="green" type="submit" loading={this.state.loading}>
            Create!!
          </Button>
        </Form>        
      </Layout>
    );
  }
}
export default CampaignNew;
