import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Change is_finished from boolean to string with default "uploading"
      table.string('is_finished').defaultTo('uploading').alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      // Revert back to boolean type with default false
      table.boolean('is_finished').defaultTo(false).alter()
    })
  }
}
