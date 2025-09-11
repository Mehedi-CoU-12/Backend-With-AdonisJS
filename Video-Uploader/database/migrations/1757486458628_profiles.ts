import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up () {
    // Drop the table if it exists (to fix any constraint issues)
    this.schema.dropTableIfExists(this.tableName)
    
    // Create the table properly
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('full_name').notNullable()
      table.string('avatar_url')
     
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
