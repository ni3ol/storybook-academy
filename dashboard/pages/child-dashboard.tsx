import {Button, Container} from 'semantic-ui-react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {Auth} from '../src/auth/hooks'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
// import HTMLFlipBook from 'react-pageflip'
import {Document, Page} from 'react-pdf'
import {pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

import {useState} from 'react'
import {WelcomeModal} from '../src/users/children/components/welcomeModal'
import router, {useRouter} from 'next/router'
import {Header} from '../src/shared/components/header'

const ChildDashboard = ({auth}: {auth: Auth}) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const {query} = useRouter()
  const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
    setNumPages(numPages)
  }

  return (
    <>
      {query?.showWelcomeModal && (
        <WelcomeModal
          user={auth.user}
          onClose={() =>
            router.push({
              pathname: '/child-dashboard',
              query: {},
            })
          }
        />
      )}
      <DashboardNavigation role={auth?.user?.role} />
      <Container>
        {/* <HTMLFlipBook width={500} height={800}>
          <div className="demoPage">
            <Document
              file={
                'https://cdn.shopify.com/s/files/1/2081/8163/files/002-GINGER-THE-GIRAFFE-Free-Childrens-Book-By-Monkey-Pen.pdf?v=1589846892'
              }
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                renderAnnotationLayer={false}
                pageNumber={pageNumber}
                width={500}
                height={800}
              />
            </Document>
          </div>
          <div className="demoPage">
            <Document
              file={
                'https://cdn.shopify.com/s/files/1/2081/8163/files/002-GINGER-THE-GIRAFFE-Free-Childrens-Book-By-Monkey-Pen.pdf?v=1589846892'
              }
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                renderAnnotationLayer={false}
                pageNumber={pageNumber + 1}
                width={500}
                height={800}
              />
            </Document>
          </div>
          <div className="demoPage">
            {' '}
            <Document
              file={
                'https://cdn.shopify.com/s/files/1/2081/8163/files/002-GINGER-THE-GIRAFFE-Free-Childrens-Book-By-Monkey-Pen.pdf?v=1589846892'
              }
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                renderAnnotationLayer={false}
                pageNumber={pageNumber + 2}
                width={500}
                height={800}
              />
            </Document>
          </div>
          <div className="demoPage">
            {' '}
            <Document

              file={
                'https://cdn.shopify.com/s/files/1/2081/8163/files/002-GINGER-THE-GIRAFFE-Free-Childrens-Book-By-Monkey-Pen.pdf?v=1589846892'
              }
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                renderAnnotationLayer={false}
                pageNumber={pageNumber + 3}
                width={500}
                height={800}
              />
            </Document>
          </div>
        </HTMLFlipBook> */}

        <Header>The book of the day is:</Header>
        <div>
          <Document
            file={
              'https://cdn.shopify.com/s/files/1/2081/8163/files/002-GINGER-THE-GIRAFFE-Free-Childrens-Book-By-Monkey-Pen.pdf?v=1589846892'
            }
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              renderAnnotationLayer={false}
              pageNumber={pageNumber}
              width={500}
              height={800}
            />
            <Button onClick={() => setPageNumber(1)}>Reset</Button>

            <Button
              onClick={() =>
                setPageNumber(pageNumber === 1 ? 1 : pageNumber - 1)
              }
            >
              Back
            </Button>
            <Button
              onClick={() =>
                setPageNumber(
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
