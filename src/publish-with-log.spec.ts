import test from 'ava'
import { createMessage } from '@zwolf/turbine'
import * as db from '@zwolf/firestore'

import { LogCollection } from './db'

import publishWithLog from './publish-with-log'

test('should set data', (t) => {
  return publishWithLog(async (message) => {
    const log = await db.get(LogCollection, message.id)

    t.deepEqual(log.data.received, {})
    t.deepEqual(log.data.sentAt, new Date(message.sentAt))
    t.deepEqual(log.data.parentId, db.ref(LogCollection, message.parentId))
    t.is(log.data.type, message.type)
    t.is(log.data.userId, message.payload.userId)
    t.is(log.data.sentFrom, message.sentFrom)
    t.true(log.data.createdAt instanceof Date)
    t.true(log.data.updatedAt instanceof Date)
  })(
    createMessage({
      type: 'test',
      payload: {
        userId: 'test',
      },
      sentFrom: 'ava',
      parentId: '123',
    }),
  )
})
