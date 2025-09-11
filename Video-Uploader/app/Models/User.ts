import { DateTime } from "luxon";
import {
    BaseModel,
    beforeSave,
    column,
    HasMany,
    hasMany,
    HasOne,
    hasOne,
    ManyToMany,
    manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Profile from "./Profile";
import Hash from "@ioc:Adonis/Core/Hash";
import Post from "./Post";
import Role from "./Role";

export default class User extends BaseModel {
    public static table = "users";

    @column({ isPrimary: true })
    public id: number;

    @column()
    public email: string;

    @column({ serializeAs: null })
    public password: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    // one to one relation with Profile model
    @hasOne(() => Profile)
    public profile: HasOne<typeof Profile>;

    @hasMany(() => Post)
    public post: HasMany<typeof Post>;

    @manyToMany(()=>Role,{
        pivotTable:'role_user'
    })
    public roles:ManyToMany<typeof Role>

    //hash the password before save
    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password);
        } else {
            console.log("password not dirty, skipping hash");
        }
    }
}
