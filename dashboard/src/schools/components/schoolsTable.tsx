import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {School} from '../model'

export const SchoolsTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: School[]
  onUpdateClick: (school: School) => any
  onDeleteClick: (school: School) => any
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'name',
        title: 'Name',
        resolve: (school) => school.name,
      },
      {
        key: 'actions',
        title: 'Actions',
        resolve: (school) => (
          <div>
            <Button basic onClick={() => onUpdateClick(school)} primary>
              Edit
            </Button>
            <Button basic color="red" onClick={() => onDeleteClick(school)}>
              Delete
            </Button>
          </div>
        ),
      },
    ]}
  />
)
