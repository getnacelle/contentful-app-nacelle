const sdk = {
  cmaAdapter: {
    makeRequest: jest.fn()
  },
  ids: {
    space: 'xxx',
    environment: 'xxx',
    app: 'appId'
  },
  contentType: {
    sys: {
      id: 'contentType'
    }
  },
  window: {
    updateHeight: jest.fn(),
    startAutoResizer: jest.fn()
  },
  app: {
    getCurrentState: jest.fn(),
    setReady: jest.fn(),
    onConfigure: jest.fn(),
    getParameters: jest.fn()
  },
  field: {
    getValue: jest.fn()
  },
  parameters: {
    invocation: {
      value: 'value from invocation'
    },
    installation: {
      nacelleSpaceId: 'spaceId',
      nacelleSpaceToken: 'spaceToken',
      nacelleEndpoint: 'endpoint'
    }
  }
}

export default sdk
