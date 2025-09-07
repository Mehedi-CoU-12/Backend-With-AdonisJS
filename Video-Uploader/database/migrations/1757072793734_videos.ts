import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "videos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      // Video information from Bunny.net
      table.string("video_id").notNullable(); // Bunny.net video ID
      table.string("library_id").notNullable(); // Bunny.net library ID
      table.string("title").nullable(); // Video title

      // Processing status
      table.boolean("is_finished").defaultTo(0); // Processing status
      table.integer("processing_status").defaultTo(0); // 0=queued, 1=processing, 2=finished, 3=failed

      // Additional metadata
      table.json("metadata").nullable(); // Additional metadata from Bunny.net

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
