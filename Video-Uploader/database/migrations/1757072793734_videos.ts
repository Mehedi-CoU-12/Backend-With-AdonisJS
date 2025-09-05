import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // Video information from Bunny.net
      table.string('video_id').notNullable() // Bunny.net video ID
      table.string('library_id').notNullable() // Bunny.net library ID  
      table.string('video_guid').nullable() // Video GUID from Bunny.net
      table.string('title').nullable() // Video title
      table.text('description').nullable() // Video description
      table.integer('duration').nullable() // Video duration in seconds
      table.string('thumbnail_url').nullable() // Thumbnail URL
      table.string('video_url').nullable() // Playback URL
      
      // Processing status
      table.boolean('is_finished').defaultTo(false) // Processing status
      table.integer('processing_status').defaultTo(0) // 0=queued, 1=processing, 2=finished, 3=failed
      
      // Additional metadata
      table.bigInteger('file_size').nullable() // File size in bytes
      table.string('original_filename').nullable() // Original uploaded filename
      table.json('metadata').nullable() // Additional metadata from Bunny.net

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
