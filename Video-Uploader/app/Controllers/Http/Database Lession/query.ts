import Profile from "App/Models/Profile";
import User from "App/Models/User";
import Post from "App/Models/Post";
import Role from "App/Models/Role";

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

    public async getAllProfilesWithUsers(){
        return await Profile.query().preload('user');
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
        return await Profile.query().where("id", id).first();
    }


    public async getProfileByIdWithUser(id:string){
        return await Profile.query().where("id",id).preload('user').first();
    }

    public async updateProfile(id: string, body: any) {
        return await Profile.query().where("user_id", id).update(body);
    }

    public async deleteProfile() {}

    // post
    public async createPost(
        user: User,
        body: {
            status?: string;
            imageUrl?: string;
        }
    ) {
        return await user.related("post").create(body);
    }

    public async getUserPosts(id:string){
        return await Post.query().where('user_id',id);
    }

    public async getSinglePost(id:string){
        return await Post.query().where('id',id);
    }

    public async getAllUsersPosts(){
        return await Post.query();
    }

    public async updatePost(
        id: string,
        body: {
            status?: string;
            imageUrl?: string;
        }
    ) {
        return await Post.query().where("id", id).update(body);
    }

    public async deletePost(id: string) {
        return await Post.query().where("id", id).delete();
    }









    //roles
    public async getAllRoles(){
        return await Role.query();
    }

    public async getRolesWithUser(id:string){
        return await Role.query().where('id',id).preload('users')
    }
}
