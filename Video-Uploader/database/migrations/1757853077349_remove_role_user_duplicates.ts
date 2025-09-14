import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_user'

  public async up () {
    // Remove duplicate entries, keeping only one record per user_id, role_id combination
    this.schema.raw(`
      DELETE ru1 FROM role_user ru1
      INNER JOIN role_user ru2
      WHERE ru1.id > ru2.id
      AND ru1.user_id = ru2.user_id
      AND ru1.role_id = ru2.role_id
    `)
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}
