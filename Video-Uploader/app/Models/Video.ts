import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public videoId: string

  @column()
  public libraryId: string

  @column()
  public title: string | null

  @column()
  public isFinished: string

  @column()
  public processingStatus: number

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value)
  })
  public metadata: any | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
