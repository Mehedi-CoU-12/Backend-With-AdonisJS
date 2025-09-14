import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_user'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
        table.unique(['user_id','role_id'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
        table.dropUnique(['user_id','role_id']) 
    })
  }
}
