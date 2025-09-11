import { DateTime } from "luxon";
import {
    BaseModel,
    beforeSave,
    column,
    HasOne,
    hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Profile from "./Profile";
import Hash from "@ioc:Adonis/Core/Hash";

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

    //hash the password before save
    @beforeSave()
    public static async hashPassword(user: User) {
        console.log('beforeSave hook triggered');
        console.log('password is dirty:', user.$dirty.password);
        console.log('dirty fields:', Object.keys(user.$dirty));
        
        if (user.$dirty.password) {
            console.log('hashing password...');
            user.password = await Hash.make(user.password);
            console.log('password hashed successfully');
        } else {
            console.log('password not dirty, skipping hash');
        }
    }
}
