import React, { Component } from 'react';
import { AppExtensionSDK, ContentType } from 'contentful-ui-extensions-sdk';
import { Card, CheckboxField, Form, FieldGroup, FormLabel, Heading, Note, Paragraph, Subheading, TextInput, TextLink, HelpText } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import logo from '../logo-dark.svg';
import axios from 'axios'

const nacelleContentfulConfigUrl = (version: string) => {
  const ts = Math.floor(Date.now() / 1000);
  return `https://nacelle-assets.s3-us-west-2.amazonaws.com/nacelle-contentful-config-v${version}.json?v=${ts}`
}
const defaultContentModels = [
  { name: 'Article', created: false },
  { name: 'Author', created: false },
  { name: 'Blog', created: false },
  { name: 'Content', created: false },
  { name: 'Global', created: false },
  { name: 'Hero Banner', created: false },
  { name: 'Page', created: false },
  { name: 'Product Grid', created: false },
  { name: 'Side By Side', created: false },
  { name: 'Testimonial', created: false },
  { name: 'Testimonials', created: false },
]

export interface AppInstallationParameters {
  nacelleSpaceId: string
  nacelleSpaceToken: string
  nacelleContentModels: NacelleContentModel[]
}

interface NacelleContentModel {
  name: string;
  created: boolean;
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
      nacelleSpaceToken: '',
      nacelleContentModels: defaultContentModels
    }
  };

  constructor(props: ConfigProps, state: ConfigState) {
    super(props);

    this.state = { parameters: {
      nacelleSpaceId: '',
      nacelleSpaceToken: '',
      nacelleContentModels: defaultContentModels
    } };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();
    const contentTypes = await this.props.sdk.space.getContentTypes();
    console.log('contentTypes', contentTypes);

    // Get Nacelle Contentful Content Type Config
    const contentModels = [] as NacelleContentModel[]
    const res = await axios.get(nacelleContentfulConfigUrl('1.0.6'));
    if (parameters && res && res.data && res.data.contentTypes) {
      res.data.contentTypes.forEach((type: any) => {
        contentModels.push({
          name: type.name,
          created: !!contentTypes.items.find((item: any) => item.name === type.name)
        })
      })
      parameters.nacelleContentModels = contentModels
    }

    console.log('params', parameters)

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
    const { nacelleContentModels } = this.state.parameters
    const checkBoxes = nacelleContentModels.map(({ name, created }) => {
      return (
        <CheckboxField
          id={`${name.toLowerCase()}-checkbox`}
          labelText={name}
          checked={created}
          disabled={created}
          helpText={created ? undefined : `Add ${name} Model`}
        />
      )
    })
    return (
      <div
        className={css({ margin: '80px' })}
      >
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
              Nacelle Space Tokeng
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

          <Card>
            <Subheading>Nacelle Content Models</Subheading>

            <FieldGroup>
              { checkBoxes }
            </FieldGroup>
          </Card>
        </Form>
        <div
          className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' })}
        >
          <img
            className={css({ height: '30px', marginBottom: '10px' })}
            src={ logo }
            alt="Nacelle Logo"
          />
            <Paragraph>Copyright © {new Date().getFullYear()} Nacelle</Paragraph>
        </div>
      </div>
    );
  }
}
