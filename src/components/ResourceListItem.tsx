import React from 'react'
import {
  Button,
  Card,
  EntityListItem,
  MenuItem
} from '@contentful/f36-components'
import { css } from 'emotion'

interface ResourceListProps {
  resource: any
  resourceLabel: string
  valueKey: string
  publishedValue: string
  index: number
  selectedIndex: number
  showJson: boolean
  handleLink: (value: string, index: number) => void
  handleOpenJson: (value: string, index: number) => void
  handleCloseJson: () => void
}

const ResourceListItem = (props: ResourceListProps) => {
  const {
    resource,
    valueKey,
    resourceLabel,
    publishedValue,
    index,
    selectedIndex,
    showJson,
    handleLink,
    handleOpenJson,
    handleCloseJson
  } = props
  const { title, productLists, tags, featuredMedia } = resource

  const resourceValue = resource[valueKey]
  let description = ''
  if (resourceLabel === 'collections') {
    description = `Products: ${
      Array.isArray(productLists) && productLists.length
        ? productLists[0].handles
        : '(Empty Collection)'
    }`
  } else {
    description = `Tags: ${tags}`
  }

  const selectedClass =
    publishedValue === resourceValue
      ? {
          border: '1px solid #2e75d4'
        }
      : {}

  return (
    <React.Fragment>
      <div className={css({ display: 'flex', maxHeight: '65px' })}>
        <EntityListItem
          className={css({ width: '85%', ...selectedClass })}
          thumbnailUrl={featuredMedia?.thumbnailSrc}
          title={title || 'Default Title'}
          description={description}
          contentType={resourceValue}
          status={publishedValue === resourceValue ? 'published' : undefined}
          actions={[
            <MenuItem
              key="edit"
              onClick={() => {
                handleOpenJson(resourceValue, index)
              }}
            >
              Show JSON
            </MenuItem>
          ]}
        />
        <div
          className={css({
            padding: '.875rem',
            borderLeft: '1px solid #d3dce0',
            borderBottom: '1px solid #d3dce0',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          })}
        >
          <Button
            size="small"
            onClick={() => {
              handleLink(resourceValue, index)
            }}
            variant="positive"
          >
            {publishedValue === resourceValue ? 'Clear' : 'Link'}
          </Button>
        </div>
      </div>
      <Card
        className={css({
          border: 'none',
          borderBottom: '1px solid #d3dce0',
          borderRadius: '0',
          display: index === selectedIndex && showJson ? 'block' : 'none'
        })}
      >
        <pre className={css({ maxHeight: '250px', overflow: 'scroll' })}>
          {resource && JSON.stringify(resource, null, 2)}
        </pre>

        <Button
          className={css({ marginLeft: '10px' })}
          onClick={handleCloseJson}
          variant="negative"
        >
          Close
        </Button>
      </Card>
    </React.Fragment>
  )
}

export default ResourceListItem
