import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'video_id' })
  public videoId: string

  @column({ columnName: 'library_id' })
  public libraryId: string

  @column()
  public title: string | null

  @column({ columnName: 'is_finished' })
  public isFinished: string

  @column({ columnName: 'processing_status' })
  public processingStatus: number

  @column({columnName:'play_link'})
  public playLink:string | null

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
