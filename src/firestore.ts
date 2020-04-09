import { collection, Ref } from '@zwolf/firestore'

export interface Log {
  createdAt: Date,
  parentId: Ref<Log>,
  payload: string,
  received: { [index: string]: { lastReceivedAt: Date, count: number } },
  sentAt: Date,
  sentFrom: string,
  type: string,
  updatedAt: Date,
  userId: string,
}

export const LogCollection = collection<Log>('zwolf_log')
