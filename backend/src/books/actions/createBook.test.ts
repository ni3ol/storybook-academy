import test from 'ava'
import {withTempTransaction} from '../../tests/utils'
import {createBook} from './createBook'

test('createBook creates book', async (t) => {
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
    t.is(book.createdByUserId, '4ae1532b-a6e9-43c3-b1bb-68e78f6155b4')
    t.is(book.title, 'Alice in Wonderland')
    t.is(book.level, 2)
  })
})
