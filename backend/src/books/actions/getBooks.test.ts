import test from 'ava'
import {withTempTransaction} from '../../tests/utils'
import {createBook} from './createBook'
import {getBooks} from './getBooks'

test('getBooks gets books', async (t) => {
  await withTempTransaction(async (trx) => {
    await createBook(
      {
        createdByUserId: '4ae1532b-a6e9-43c3-b1bb-68e78f6155b4',
        title: 'Alice in Wonderland',
        level: 2,
      },
      {trx, skipAuth: true},
    )
    await getBooks({trx, skipAuth: true})

    const books = await getBooks({trx, skipAuth: true})
    t.is(books.length, 1)
    t.truthy(books[0].id)
    t.is(books[0].title, 'Alice in Wonderland')
  })
})
