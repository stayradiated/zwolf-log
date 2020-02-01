import * as db from '@zwolf/firestore'
import {
  debuglog,
  SubscribeFn,
  SubscriptionHandlerFn,
  SubscriptionHandler,
} from '@zwolf/turbine'

import { LogCollection } from './db'

const subscribeWithLog = (subscribeFn: SubscribeFn): SubscribeFn => {
  return async (options) => {
    const { serviceName, subscriptionHandlers } = options

    const subscriptionHandlersWithLog = subscriptionHandlers.map<
    SubscriptionHandler
    >((event) => {
      const { type, handlerFn } = event

      const handleFnWithLog: SubscriptionHandlerFn = async (message) => {
        const { id, type, payload } = message

        debuglog(`RECEIVE [${id}] ${type}(${JSON.stringify(payload)})`)

        const log = await db.get(LogCollection, id)
        if (log == null) {
          debuglog(`Log ${id} does not exist in store.`)
        } else {
          const escapedServiceName = serviceName.replace(/[^a-z0-9]/gi, '_')

          await db.update(LogCollection, id, [
            db.field('updatedAt', db.value('serverDate')),
            db.field(
              ['received', escapedServiceName],
              db.value('arrayUnion', [db.value('serverDate')]),
            ),
          ])
        }

        return handlerFn(message)
      }

      return { type, handlerFn: handleFnWithLog }
    })

    const result = await subscribeFn({
      ...options,
      subscriptionHandlers: subscriptionHandlersWithLog,
    })

    console.info(`Service "${serviceName}" has successfully started.`)

    return result
  }
}

export default subscribeWithLog
