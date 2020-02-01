import { Driver } from '@zwolf/turbine'

import publishWithLog from './publish-with-log'
import subscribeWithLog from './subscribe-with-log'

const log = (driver: Driver) => {
  const { publish, subscribe } = driver

  return {
    publish: publishWithLog(publish),
    subscribe: subscribeWithLog(subscribe),
  }
}

export default log
