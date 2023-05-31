import React from 'react'
import Dialog from './Dialog'
import { render, screen, act } from '@testing-library/react'
import mockSdk from '../../__mocks__/sdk'
import { DialogAppSDK } from 'contentful-ui-extensions-sdk'

describe('Dialog component', () => {
  it('Component text exists', async () => {
    await act(async () => {
      render(<Dialog sdk={mockSdk as unknown as DialogAppSDK} />)
    })
    expect(screen.getByText('Search for collections')).toBeInTheDocument()
  })
})
