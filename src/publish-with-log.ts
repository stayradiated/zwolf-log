import * as db from '@zwolf/firestore'
import { PublishFn } from '@zwolf/turbine'

import { LogCollection } from './firestore'

const publishWithLog = (publishFn: PublishFn): PublishFn => {
  return async (message) => {
    const { id, parentId, sentFrom, sentAt, type, payload } = message

    console.log(`PUBLISH ${type}(${JSON.stringify(payload)})`)

    await db.set(LogCollection, id, {
      createdAt: db.value('serverDate'),
      parentId: parentId ? db.ref(LogCollection, parentId) : null,
      payload,
      received: {},
      sentAt: new Date(sentAt),
      sentFrom,
      type,
      updatedAt: db.value('serverDate'),
      userId: payload.userId,
    })

    return publishFn(message)
  }
}

export default publishWithLog
