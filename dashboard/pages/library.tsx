import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {LibraryTable} from '../src/library/components/libraryTable/libraryTable'
import {Header} from '../src/shared/components/header'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'

export default function Library() {
  return (
    <RequireAuth
      render={({auth}) => {
        return (
          <>
            <DashboardNavigation role={auth?.user?.role} />
            <Container>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Header as="h1">Library</Header>
                <Button primary>Add material</Button>
              </div>
              <LibraryTable
                onUpdateClick={() => null}
                onDeleteClick={() => null}
                rows={[
                  {
                    title: 'The lion king',
                    course: 'Conservation',
                    area: 'Science',
                    readingDate: '',
                    levels: '1, 2, 3',
                  },
                  {
                    title: 'Water in Kenya',
                    course: 'Conservation',
                    area: 'Science',
                    readingDate: '22 April 2022',
                    levels: '1, 2',
                  },
                ]}
              />
            </Container>
          </>
        )
      }}
    />
  )
}
