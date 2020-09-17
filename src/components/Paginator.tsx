import React from 'react';
import {
  Paragraph,
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';

interface PaginatorProps {
  pageCount: number;
  current: number;
  toPage: (disabled: boolean, page: number) => void;
}

const Paginator = (props: PaginatorProps) => {
  const { pageCount, current, toPage } = props
  let pages = Array.from({length: Math.min(pageCount, 5)}, (_, i) => i + 1)
  const prevDisabled = current === 1
  const nextDisabled = current === pageCount

  if (current >= 4) {
    pages = [(current - 2), (current - 1), current]
    const remainder = pageCount - current
    if (remainder >= 1) {
      pages.push((current + 1))
    }
    if (remainder >= 2) {
      pages.push((current + 2))
    }
  }

  return (
    <div
      className={css({
        color: '#b4c3ca',
        marginBottom: '0.75rem 0px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      })}
      data-test-id="paginator"
    >
      <Paragraph
        aria-disabled={ prevDisabled ? 'true' : 'false' }
        data-test-id="paginator.prev"
        className={css({
          color: ( prevDisabled ? '#e5ebed' : '#b4c3ca' ),
          marginRight: '30px',
          textDecoration: 'none',
          cursor: ( prevDisabled ? 'default' : 'pointer' ),
          '&::before': {
            content: '"‹"',
            marginRight: '5px'
          }
        })}
      ><span onClick={() => {toPage(prevDisabled, current - 1)}}>Previous</span></Paragraph>

      <div
        className={css({ display: 'flex' })}
        data-test-id="paginator.pages"
      >
        {
          pages.map((page) => {
            const selected = page === current
            return (
              <span key={page} onClick={() => {toPage(selected, page)}}>
                <Paragraph
                  aria-selected={selected ? 'true' : 'false'}
                  className={css({
                    color: (selected ? '#192532' : '#b4c3ca'),
                    background: (selected ? '#e5ebed' : 'initial'),
                    marginLeft: '10px',
                    padding: '10px',
                    cursor: 'pointer'
                  })}
                >
                  { page }
                </Paragraph>
              </span>
            )
          })
        }
        <Paragraph
          className={css({
            color: '#b4c3ca',
            marginLeft: '10px',
            padding: '10px',
            cursor: 'default'
          })}
        >
          {( pageCount > current + 2 ? '...' : '' )}
        </Paragraph>
      </div>

      <Paragraph
        aria-disabled={ nextDisabled ? 'true' : 'false' }
        data-test-id="paginator.next"
        className={css({
          color: ( nextDisabled ? '#e5ebed' : '#b4c3ca' ),
          marginLeft: '40px',
          textDecoration: 'none',
          cursor: ( nextDisabled ? 'default' : 'pointer' ),
          '&::after': {
            content: '"›"',
            marginLeft: '5px'
          }
        })}
      >
        <span onClick={() => {toPage(nextDisabled, current + 1)}}>Next</span>
      </Paragraph>
    </div>
  )
}

export default Paginator;