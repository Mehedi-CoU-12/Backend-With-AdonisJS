import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('category').nullable();
      table.integer('duration').unsigned().nullable();
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category')
      table.dropColumn('duration')
    })
  }
}
