import React from 'react'
import {Table} from 'semantic-ui-react'

export const DataTable = <R,>({
  headers,
  rows,
}: {
  headers: {key: string; resolve: (row: R) => any; title: string}[]
  rows: R[]
}) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {headers.map((header) => {
            return (
              <Table.HeaderCell key={header.key}>
                {header.title}
              </Table.HeaderCell>
            )
          })}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {rows.map((row) => {
          return (
            <Table.Row key={JSON.stringify(row)}>
              {headers.map((header) => {
                return (
                  <Table.Cell key={header.key}>
                    {header.resolve(row)}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
