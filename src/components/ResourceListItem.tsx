import React from 'react'
import {
  Button,
  Card,
  DropdownList,
  DropdownListItem,
  EntityListItem,
} from '@contentful/forma-36-react-components'
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
    handleCloseJson,
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
          border: '1px solid #2e75d4',
          boxShadow: '0 0 5px #2e75d4',
        }
      : {}

  return (
    <React.Fragment>
      <div className={css({ display: 'flex' })}>
        <EntityListItem
          className={css({ flex: '1', width: '87%', ...selectedClass })}
          thumbnailUrl={featuredMedia?.thumbnailSrc}
          title={title || 'Default Title'}
          description={description}
          contentType={resourceValue}
          status={publishedValue === resourceValue ? 'published' : undefined}
          dropdownListElements={
            <DropdownList testId='cf-ui-dropdown-list'>
              <DropdownListItem
                isActive={false}
                isDisabled={false}
                isTitle={false}
                onClick={() => {
                  handleOpenJson(resourceValue, index)
                }}
              >
                Show JSON
              </DropdownListItem>
            </DropdownList>
          }
          entityType='asset'
        />
        <div
          className={css({
            padding: '.875rem',
            borderLeft: '1px solid #d3dce0',
            borderBottom: '1px solid #d3dce0',
          })}
        >
          <Button
            size='small'
            onClick={() => {
              handleLink(resourceValue, index)
            }}
            buttonType='positive'
            disabled={publishedValue === resourceValue}
          >
            Link
          </Button>
        </div>
      </div>
      <Card
        className={css({
          display: index === selectedIndex && showJson ? 'block' : 'none',
        })}
      >
        <pre className={css({ maxHeight: '200px', overflow: 'scroll' })}>
          {resource && JSON.stringify(resource, null, 2)}
        </pre>

        <Button
          className={css({ marginLeft: '10px' })}
          onClick={handleCloseJson}
          buttonType='muted'
        >
          Close
        </Button>
      </Card>
    </React.Fragment>
  )
}

export default ResourceListItem
