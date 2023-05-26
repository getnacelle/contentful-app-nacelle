import React from 'react'
import Page from './Page'
import { render, screen, act } from '@testing-library/react'
import { BaseAppSDK } from 'contentful-ui-extensions-sdk'
import mockSdk from '../../__mocks__/sdk'
import mockContentTypes from '../../__mocks__/contentTypes'
import mockEditorInterfaces from '../../__mocks__/editorInterfaces'


const mockGetContentType = jest.fn()
const mockGetEditorInterfaces = jest.fn()

const mockGetEnvironment = () => {
  return {
    getContentTypes: mockGetContentType,
    getEditorInterfaceForContentType: mockGetEditorInterfaces
  }
}

jest.mock('contentful-management', () => {
  return {
    createClient: () => {
      return {
        getSpace: () => {
          return {
            getEnvironment: mockGetEnvironment
          }
        }
      }
    }
  }
})

describe('Page component', () => {
  beforeEach(() => {
    mockGetContentType.mockImplementation(() => Promise.resolve(mockContentTypes))
    mockGetEditorInterfaces.mockImplementation(() => Promise.resolve(mockEditorInterfaces))
  })

  it('Component text exists', async () => {
    await act(async () => {
      render(<Page sdk={mockSdk as unknown as BaseAppSDK} />)
    })

    expect(screen.getByText('Nacelle Refs')).toBeInTheDocument()
  })
})
