import test from 'ava'
import {withTempTransaction} from '../../tests/utils'
import {createBook} from './createBook'
import {updateBook} from './updateBook'

test('updateBook updates book', async (t) => {
  await withTempTransaction(async (trx) => {
    const book = await createBook(
      {
        createdByUserId: '4ae1532b-a6e9-43c3-b1bb-68e78f6155b4',
        title: 'Alice in Wonderland',
        level: 2,
      },
      {trx, skipAuth: true},
    )
    t.truthy(book.id)
    t.is(book.title, 'Alice in Wonderland')

    const updatedBook = await updateBook(
      book.id,
      {title: 'My little Pony'},
      {trx, skipAuth: true},
    )
    t.is(updatedBook.id, book.id)
    t.is(updatedBook.title, 'My little Pony')
  })
})
