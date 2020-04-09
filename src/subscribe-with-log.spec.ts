import test from 'ava'
import { createMessage } from '@zwolf/turbine'
import * as db from '@zwolf/firestore'

import { LogCollection } from './firestore'

import subscribeWithLog from './subscribe-with-log'

test('should append received date', (t) => {
  return subscribeWithLog(async (options) => {
    const { subscriptionHandlers } = options

    const message = createMessage({
      type: 'test',
      payload: {},
    })

    await db.set(LogCollection, message.id, {
      createdAt: db.value('serverDate'),
      parentId: null,
      payload: message.payload,
      received: {},
      sentAt: new Date(message.sentAt),
      sentFrom: message.sentFrom,
      type: message.type,
      updatedAt: db.value('serverDate'),
      userId: message.payload.userId,
    })

    await subscriptionHandlers[0].handlerFn(message)

    const log = await db.get(LogCollection, message.id)

    t.truthy(log.data.received['test_test'])
    t.is(log.data.received['test_test'].count, 1)
    t.true(log.data.received['test_test'].lastReceivedAt instanceof Date)
  })({
    serviceName: 'test.test',
    subscriptionHandlers: [
      {
        type: 'a',
        handlerFn: () => null,
      },
    ],
  })
})
