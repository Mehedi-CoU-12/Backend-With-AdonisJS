import { faker } from "@faker-js/faker";
import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Role from "App/Models/Role";
import User from "App/Models/User";

export default class extends BaseSeeder {
    public async run() {
        //1. truncate all the tables
        await Database.rawQuery("SET FOREIGN_KEY_CHECKS=0;");
        await Database.rawQuery("TRUNCATE TABLE posts");
        await Database.rawQuery("TRUNCATE TABLE profiles");
        await Database.rawQuery("TRUNCATE TABLE users");
        await Database.rawQuery("TRUNCATE TABLE role_user");
        await Database.rawQuery("TRUNCATE TABLE roles");
        await Database.rawQuery("SET FOREIGN_KEY_CHECKS=1;");

        //2. create roles
        const roles = await Role.createMany([
            { name: "admin" },
            { name: "editor" },
            { name: "user" },
        ]);

        //3. create user+profile+post
        for (let i = 0; i < 30; i++) {
            //user
            const user = await User.create({
                email: faker.internet.email(),
                password: "1234",
            });

            //profile
            await user.related("profile").create({
                fullName: faker.person.fullName(),
                avatarUrl: faker.image.avatar(),
            });

            //post
            for (let j = 0; j < 3; j++) {
                await user.related("post").create({
                    status: faker.lorem.sentence(),
                    imageUrl: faker.image.url(),
                });
            }

            const randomRoles = roles
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * roles.length) + 1);

            await user.related("roles").attach(randomRoles.map((r) => r.id));
        }
    }
}
