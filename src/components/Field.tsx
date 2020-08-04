import React, { Component } from 'react';
import { Button, Card, Icon } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import logo from '../logo.svg';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {}

interface DialogParameters {
  location: string
  contentType: string
  value: string
  resourceLabel: string
}

export default class Field extends Component<FieldProps, FieldState> {
  state = {
    value: ''
  }

  constructor(props: FieldProps) {
    super(props)

    this.state = {
      value: ''
    }
  }

  async componentDidMount() {
    this.setState({
      value: this.props.sdk.field.getValue()
    })
  }

  handleLink = async (parameters: DialogParameters) => {
    const { dialogState } = await this.props.sdk.dialogs.openCurrentApp({
      minHeight: 400,
      allowHeightOverflow: true,
      parameters
    })
    if (dialogState) {
      this.props.sdk.field.setValue(dialogState.value)
      this.setState({ value: dialogState.value })
    }
  }

  render() {
    const location = 'Field'
    const contentType = this.props.sdk.contentType.sys.id
    const fieldId = this.props.sdk.field.id

    let resourceLabel = 'Collection'
    if (fieldId.includes('collection') || contentType === 'productGrid') {
      resourceLabel = 'Collection'
    } else if (fieldId.includes('product')) {
      resourceLabel = 'Product'
    } else {
      resourceLabel = 'Resource'
    }

    return (
      <Card className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
        <span className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
          <Icon
            className={css({ marginRight: '10px' })}
            icon="Link"
            color="muted"
            size="medium"
          />
          { this.state.value }
        </span>
        <Button
          size="small"
          onClick={ () => (this.handleLink({
            location,
            contentType,
            resourceLabel,
            value: this.state.value
          })) }
        >Link { resourceLabel }</Button>
      </Card>
    )
  }
}