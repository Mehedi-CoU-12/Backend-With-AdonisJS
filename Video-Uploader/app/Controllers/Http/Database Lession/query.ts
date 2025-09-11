import Profile from "App/Models/Profile";
import User from "App/Models/User";

export default class Queries {
    //user
    public async getAllUsers() {
        return await User.query();
    }

    public async createUser(body: { email: string; password: string }) {
        return await User.create(body);
    }

    public async getUserById(id: string) {
        return await User.query().where("id", id).first();
    }

    public async updateUser(
        id: string,
        body: {
            email?: string;
            password?: string;
        }
    ) {
        return await User.query().where("id", id).update(body);
    }

    public async deleteUser(id: string) {
        return await User.query().where("id", id).delete();
    }

    //profile

    public async getAllProfiles() {
        return await Profile.query();
    }
    public async createProfile(
        user: User,
        body: {
            fullName: string;
            avatarUrl: string;
        }
    ) {
        return await user.related("profile").create(body);
    }

    public async getProfileById(id: string) {
        return await Profile.query().where("user_id", id).first();
    }

    public async updateProfile(id: string, body: any) {
        return await Profile.query().where("user_id", id).update(body);
    }

    public async deleteProfile() {}
}
