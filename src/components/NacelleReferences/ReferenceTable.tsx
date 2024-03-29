import React, { useState } from 'react'
import {
  Table,
  Popover,
  IconButton,
  Box,
  Button
} from '@contentful/f36-components'
import { MoreHorizontalIcon, SettingsIcon } from '@contentful/f36-icons'
import { css } from 'emotion'
import arrowForward from '../../arrowForward.svg'

export interface ReferenceTableRow {
  type: string
  field: string
  nacelleReference: string
  link: string
}

const ReferenceTable = (props: { data: ReferenceTableRow[] }) => {
  const [openIndex, setOpenIndex] = useState(-1)

  const row = {
    border: '0',
    margin: '0',
    background: 'red'
  }

  const tableRows = props.data.map((item, index) => {
    return (
      <Table.Row key={`${item.field}::${item.type}`} className={css(row)}>
        <Table.Cell>
          <strong>{item.type}</strong>
        </Table.Cell>
        <Table.Cell>{item.field}</Table.Cell>
        <Table.Cell>{item.nacelleReference}</Table.Cell>
        <Table.Cell>
          <Popover
            isOpen={index === openIndex}
            onClose={() => setOpenIndex(-1)}
          >
            <Popover.Trigger>
              <IconButton
                className={css({
                  float: 'right',
                  marginRight: '36px'
                })}
                onClick={() => setOpenIndex(index)}
                variant="transparent"
                aria-label="Select the date"
                icon={<MoreHorizontalIcon variant="muted" size="small" />}
              />
            </Popover.Trigger>
            <Popover.Content>
              <Box
                className={css({
                  padding: '4px'
                })}
              >
                <Button
                  className={css({
                    padding: '0 5px',
                    fontWeight: 'normal',
                    minHeight: '32px'
                  })}
                  variant="transparent"
                  as="a"
                  href={item.link}
                  target="_blank"
                >
                  <span
                    className={css({
                      display: 'flex',
                      gap: '25px',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      margin: '0',
                      padding: '0'
                    })}
                  >
                    <span>View content type</span>
                    <img
                      className={css({ height: '18px' })}
                      src={arrowForward}
                      alt="arrow forward icon"
                    />
                  </span>
                </Button>
              </Box>
            </Popover.Content>
          </Popover>
        </Table.Cell>
      </Table.Row>
    )
  })
  return (
    <Table
      className={css({
        boxShadow: '0 0 0 0'
      })}
    >
      <Table.Head>
        <Table.Row className={css(row)}>
          <Table.Cell>Type</Table.Cell>
          <Table.Cell>Field</Table.Cell>
          <Table.Cell>Nacelle Reference</Table.Cell>
          <Table.Cell>
            <SettingsIcon
              variant="muted"
              size="medium"
              className={css({
                float: 'right',
                marginRight: '50px'
              })}
            />
          </Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{tableRows}</Table.Body>
    </Table>
  )
}

export default ReferenceTable
