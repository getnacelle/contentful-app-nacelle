import React, { Component } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Button, Card, Form, FormLabel, Heading, Icon, Note, Paragraph, Subheading, TextInput, TextLink, Workbench, HelpText } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import logo from '../logo.svg';

export interface AppInstallationParameters {
  nacelleSpaceId: string
  nacelleSpaceToken: string
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  state = {
    parameters: {
      nacelleSpaceId: '',
      nacelleSpaceToken: ''
    }
  };

  constructor(props: ConfigProps, state: ConfigState) {
    super(props);

    this.state = { parameters: {
      nacelleSpaceId: '',
      nacelleSpaceToken: ''
    } };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    console.log('', this.props.sdk)
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters,
      // Transformation of an environment performed in the
      // installation process.
      targetState: {
        EditorInterface: {
          // A content type id where we will assign the app to the sidebar
          'productGrid': {
              // assignment to sidebar in position 0 (will show up at the very top of the sidebar)
              sidebar: { position: 0 }
          }
        }
      },
    };
  };

  onParameterChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState(state => ({
      parameters: { ...state.parameters, [key]: value }
    }));
  };

  render() {
    return (
      <Workbench
        className={css({ margin: '80px' })}
      >
        <Workbench.Content>
          <Form>
            <Heading>Configuration</Heading>
            <Note title="Nacelle x Contentful">
              <Paragraph>
                Welcome, once you add your Nacelle Space info, we can properly link accounts!
              </Paragraph>
            </Note>

            <Card>
              <Subheading>Nacelle Space Settings</Subheading>
              <HelpText>
                (<TextLink href="https://dashboard.getnacelle.com" target="_blank">Dashboard</TextLink>)
              </HelpText>
              <br />
              <FormLabel htmlFor="nacelleSpaceId">
                Nacelle Space Id
              </FormLabel>
              <TextInput
                name="nacelleSpaceId"
                type="text"
                width="large"
                className="f36-margin-bottom--m"
                placeholder="Nacelle Space Id"
                value={ this.state.parameters.nacelleSpaceId }
                onChange={event =>
                  this.onParameterChange('nacelleSpaceId', event)
                }
              />
              <FormLabel htmlFor="nacelleSpaceToken">
                Nacelle Space Token
              </FormLabel>
              <TextInput
                name="nacelleSpaceToken"
                type="text"
                width="large"
                className="f36-margin-bottom--m"
                placeholder="Nacelle Space Token"
                value={ this.state.parameters.nacelleSpaceToken }
                onChange={event =>
                  this.onParameterChange('nacelleSpaceToken', event)
                }
              />
            </Card>
          </Form>
        </Workbench.Content>
      </Workbench>
    );
  }
}
