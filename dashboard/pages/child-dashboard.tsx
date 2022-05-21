import {Button, Container} from 'semantic-ui-react'
import {Document, Page, pdfjs} from 'react-pdf'
import {useEffect, useState} from 'react'
import router, {useRouter} from 'next/router'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {Auth} from '../src/auth/hooks'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
// import HTMLFlipBook from 'react-pageflip'
import {WelcomeModal} from '../src/users/components/welcomeModal'
import {Header} from '../src/shared/components/header'
import {usePromise, usePromiseLazy} from '../src/shared/hooks'
import {downloadImageFromS3} from '../src/books/actions/downloadImageFromS3'
import {getClasses} from '../src/classes/actions/getClasses'
import {getUsers} from '../src/users/actions/getUsers'
import {getBooks} from '../src/books/actions/getBooks'
import {getBookSessions} from '../src/bookSessions/actions/getBookSessions'
import {updateBookSession} from '../src/bookSessions/actions/updateBookSession'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const ChildDashboard = ({auth}: {auth: Auth}) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [localPageNumber, setPageNumber] = useState(1)
  const {query} = useRouter()
  const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
    setNumPages(numPages)
  }
  const [bookUrl, setBookUrl] = useState<string | undefined>()

  const getUserAction = usePromise(async () => {
    const [user] = await getUsers({
      authToken: auth.token,
      filters: {id: auth.userId},
    })
    return user
  }, [])
  const user = getUserAction.result

  const getClassAction = usePromise(async () => {
    const [theClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: user?.classId ? {id: user.classId} : {},
    })
    return theClass
  }, [])

  const theClass = getClassAction.result

  const levelMapping: {[key: string]: any} = {
    1: {fileName: 'level1Name', fileType: 'level1Type'},
    2: {fileName: 'level2Name', fileType: 'level2Type'},
    3: {fileName: 'level3Name', fileType: 'level3Type'},
    4: {fileName: 'level4Name', fileType: 'level4Type'},
    5: {fileName: 'level5Name', fileType: 'level5Type'},
  }

  const getBookAction = usePromise(async () => {
    const [book] = await getBooks({
      authToken: auth.token,
      filters: theClass?.bookId ? {id: theClass?.bookId} : {},
    })
    return book
  }, [])
  const book = getBookAction.result

  const readingLevelKey = user?.readingLevel
    ? user.readingLevel.toString()
    : '1'

  const getBookUrlAction = usePromise(async () => {
    const url = await downloadImageFromS3({
      authToken: auth.token,
      fileName: (book as any)[levelMapping[readingLevelKey].fileName],
      fileType: (book as any)[levelMapping[readingLevelKey].fileType],
    })
    return url
  }, [book])

  useEffect(() => {
    getUserAction.execute()
    setBookUrl(getBookUrlAction.result)
  }, [getBookUrlAction.result])

  const bookSessionAction = usePromise(async () => {
    if (user) {
      const [bookSession] = await getBookSessions({
        filters: {childId: user.id},
        authToken: auth.authSession.token!,
      })
      return bookSession
    }
  }, [user])
  const bookSession = bookSessionAction.result

  useEffect(() => {
    const interval = setInterval(() => {
      bookSessionAction.execute()
    }, 2000)
    return () => clearInterval(interval)
  }, [user])

  const updateBookSessionAction = usePromiseLazy(
    async ({id, data}: {id: string; data: {page: number}}) => {
      const updatedBookSession = await updateBookSession({
        id,
        data,
        authToken: auth.authSession.token!,
      })
      bookSessionAction.setResult(updatedBookSession)
    },
    [],
  )

  const handlePageChange = async (page: number) => {
    if (bookSession) {
      await updateBookSessionAction.execute({id: bookSession.id, data: {page}})
    }
    setPageNumber(page)
  }

  const pageNumber = bookSession?.page || localPageNumber

  return (
    <>
      {query?.showWelcomeModal && user && (
        <WelcomeModal
          user={user}
          onClose={() =>
            router.push({
              pathname: '/child-dashboard',
              query: {},
            })
          }
        />
      )}
      <DashboardNavigation role={auth?.user?.role} user={user} />
      <Container>
        <Header>The book of the day is:</Header>
        <div>
          <Document file={bookUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              renderAnnotationLayer={false}
              pageNumber={pageNumber}
              width={500}
              height={800}
            />
            <Button onClick={() => handlePageChange(1)}>Reset</Button>

            <Button
              onClick={() =>
                handlePageChange(pageNumber === 1 ? 1 : pageNumber - 1)
              }
            >
              Back
            </Button>
            <Button
              onClick={() =>
                handlePageChange(
                  pageNumber === numPages ? numPages : pageNumber + 1,
                )
              }
            >
              Next
            </Button>
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      </Container>
    </>
  )
}

export default function ChildDashboardPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <ChildDashboard auth={auth} />
      }}
    />
  )
}
