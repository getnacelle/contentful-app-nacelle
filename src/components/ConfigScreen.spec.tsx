import React from 'react';
import ConfigScreen from './ConfigScreen';
import { render, screen, act } from '@testing-library/react'
import mockSdk from '../../__mocks__/sdk'
import { ConfigAppSDK } from "contentful-ui-extensions-sdk";


describe('Config Screen component', () => {
  it('Component text exists', async () => {
    await act(async () => {
      render(<ConfigScreen sdk={mockSdk as unknown as ConfigAppSDK} />)
    })
    expect(screen.getByText('Nacelle Space Token')).toBeInTheDocument()

  });
});
