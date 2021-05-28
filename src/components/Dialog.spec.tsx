import React from 'react'
import Dialog from './Dialog'
import { render } from '@testing-library/react'
import { DialogExtensionSDK as sdk } from 'contentful-ui-extensions-sdk'

describe('Dialog component', () => {
  const mockSdk: any = {
    window: {
      startAutoResizer: jest.fn(),
    },
    parameters: {
      installation: {
        nacelleSpaceId: 'xxx',
        nacelleSpaceToken: 'xxx',
        // Test for apps with only one space
        spaces: undefined,
      },
      invocation: {
        value: 'xxx',
      },
    },
  }
  it('Component text exists', () => {
    const { getByText } = render(<Dialog sdk={mockSdk} />)

    expect(getByText('Products')).toBeInTheDocument()
  })
})
