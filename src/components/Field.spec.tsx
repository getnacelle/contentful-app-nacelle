import React from 'react'
import Field from './Field'
import { render, screen, act } from '@testing-library/react'
import mockSdk from '../../__mocks__/sdk'
import { FieldAppSDK } from 'contentful-ui-extensions-sdk'

describe('Field component', () => {
  beforeEach(() => {
    mockSdk.field.getValue.mockImplementation(() => 'Hello Entry Field Component')
  })
  it('Component text exists', async () => {
    await act(async () => {
      render(<Field sdk={mockSdk as unknown as FieldAppSDK} />)
    })
    expect(screen.getByText('Hello Entry Field Component')).toBeInTheDocument()
  })
})
