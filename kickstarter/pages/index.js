import React, { Component } from "react";
import factory from "../ethereum/factory";
import Layout from "../components/layout";
import { Card, Button } from "semantic-ui-react";
import { Link } from "../router";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>veiw compaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                style={{ marginTop: "15px" }}
                floated="right"
                content="Create Campaign"
                icon="add circle"
                labelPosition="left"
                primary
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}
export default CampaignIndex;
