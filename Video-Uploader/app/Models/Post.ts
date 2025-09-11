import { DateTime } from "luxon";
import {
    BaseModel,
    BelongsTo,
    belongsTo,
    column,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Post extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column({ columnName: "user_id" })
    public userId: number;

    @column({ columnName: "status" })
    public status: string;

    @column({ columnName: "image_url" })
    public imageUrl: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;
}
