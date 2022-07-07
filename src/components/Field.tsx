import React, { Component } from 'react'
import { Button, Card, Icon } from '@contentful/forma-36-react-components'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { css } from 'emotion'
import { DialogValue } from './Dialog'
import logo from '../logo-dark.svg'

interface FieldProps {
  sdk: FieldExtensionSDK
}

interface FieldState {}

interface DialogParameters {
  location: string
  contentType: string
  value: DialogValue
  valueKey: string
}

export default class Field extends Component<FieldProps, FieldState> {
  state = {
    value: {
      type: 'NacelleReference',
      referenceType: '',
      handle: '',
      nacelleEntryId: '',
      locale: ''
    }
  }

  constructor(props: FieldProps) {
    super(props)

    this.state = {
      value: {
        type: 'NacelleReference',
        referenceType: '',
        handle: '',
        nacelleEntryId: '',
        locale: ''
      }
    }
  }

  async componentDidMount() {
    this.props.sdk.window.updateHeight()
    this.setState({
      value: this.props.sdk.field.getValue()
    })
  }

  handleLink = async (parameters: DialogParameters) => {
    const data = await this.props.sdk.dialogs.openCurrentApp({
      title: `Choose Resource`,
      minHeight: 400,
      allowHeightOverflow: true,
      parameters
    })
    if (data && data.dialogState) {
      const { dialogState } = data
      if (parameters.value === dialogState.value) {
        this.props.sdk.field.setValue({
          type: 'NacelleReference',
          referenceType: '',
          handle: '',
          nacelleEntryId: '',
          locale: ''
        })
        this.setState({
          value: {
            type: 'NacelleReference',
            referenceType: '',
            handle: '',
            nacelleEntryId: '',
            locale: ''
          }
        })
      } else {
        console.log('dialogState', dialogState)
        this.props.sdk.field.setValue(dialogState.value)
        this.setState({ value: dialogState.value })
      }
    }
  }

  render() {
    const location = 'Field'
    const contentType = this.props.sdk.contentType.sys.id

    return (
      <Card
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        })}
      >
        <span
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          })}
        >
          <img
            className={css({
              height: '15px',
              width: '15px',
              marginRight: '10px'
            })}
            src={logo}
            alt="Nacelle Logo Light"
          />
          <Icon
            className={css({ marginRight: '10px' })}
            icon="Link"
            color="muted"
            size="medium"
          />
          {this.state.value.handle}
        </span>
        <Button
          size="small"
          onClick={() =>
            this.handleLink({
              location,
              contentType,
              value: this.state.value
            })
          }
        >
          Link Resource
        </Button>
      </Card>
    )
  }
}
