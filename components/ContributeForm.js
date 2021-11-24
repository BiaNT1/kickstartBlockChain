import React , { Component } from "react";
import { render } from "react-dom";
import { Form,Input, Label, Button,Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign"
import web3 from "../ethereum/web3";
import { Router } from "../routes"

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: "",
        loading: false
    }
    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        this.setState({ loading: true, errorMessage: '' })
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`); 
                    
        } catch (error) {
            this.setState({ errorMessage: error.message, loading: false });
        }
        this.setState({ loading: false, value: '' })  
    }
    render() {
        return(
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <Label>Amount To Contribute</Label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value= {this.state.value}
                        onChange = {(event) => this.setState({ value: event.target.value})}
                    />
                    <Message error header="Oops?" content={this.state.errorMessage}/>
                    <Button color='green' loading={this.state.loading}> 
                        Contribute!!
                    </Button>
                </Form.Field>
            </Form>
        )
    }
};
export default ContributeForm;