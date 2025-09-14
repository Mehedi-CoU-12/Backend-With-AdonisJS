import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Queries from "./query";
import { Exception } from "@adonisjs/core/build/standalone";

export default class Controller {
    private queries: Queries;
    constructor() {
        this.queries = new Queries();
    }

    //user
    public async createUser(ctx: HttpContextContract) {
        const { email, password } = ctx.request.all();
        const { fullName, avatarUrl } = ctx.request.all();

        //create user
        const user = await this.queries.createUser({ email, password });
        //create profile
        const profile = await this.queries.createProfile(user, {
            fullName,
            avatarUrl,
        });

        return { user, profile };
    }

    public async getSingleUser(ctx: HttpContextContract) {
        const userId = ctx.params.id;
        return await this.queries.getUserById(userId);
    }

    public async getAllUsers() {
        return await this.queries.getAllUsers();
    }

    public async updateUser(ctx: HttpContextContract) {
        const { email, password } = ctx.request.all();
        const userId = ctx.params.id;

        const user = await this.queries.getUserById(userId);

        if (!user)
            throw new Exception("User Not Found!", 404, "E_INVALID_REQUEST");

        return await this.queries.updateUser(userId, { email, password });
    }

    public async deleteUser(ctx: HttpContextContract) {
        const userId = ctx.params.id;

        const user = await this.queries.getUserById(userId);

        if (!user)
            throw new Exception("User Not Found!", 404, "E_INVALID_REQUEST");

        return await this.queries.deleteUser(userId);
    }

    //profile
    public async getSingleProfile(ctx: HttpContextContract) {
        const profileId = ctx.params.id;

        return await this.queries.getProfileById(profileId);
    }

    public async getSingleProfileWithUser(ctx:HttpContextContract){
        const profileId=ctx.params.id;

        return await this.queries.getProfileByIdWithUser(profileId);
    }

    public async getAllProfiles() {
        return await this.queries.getAllProfiles();
    }

    public async getAllProfilesWithUsers(){
        return await this.queries.getAllProfilesWithUsers();
    }

    public async updateProfile(ctx: HttpContextContract) {
        const userId = ctx.params.id;
        const body = ctx.request.all();

        const user = await this.queries.getUserById(userId);

        if (!user)
            throw new Exception("User Not Found!", 404, "E_INVALID_REQUEST");

        return await this.queries.updateProfile(userId, body);
    }

    //post
    public async createPost(ctx: HttpContextContract) {
        const userId = ctx.params.id;
        const body = ctx.request.all();

        const user = await this.queries.getUserById(userId);

        if (!user)
            throw new Exception("User Not Found!", 404, "E_INVALID_REQUEST");

        return await this.queries.createPost(user, body);
    }

    public async getUserPosts(ctx: HttpContextContract) {
        const userId = ctx.params.id;

        return await this.queries.getUserPosts(userId);
    }

    public async getSinglePost(ctx: HttpContextContract) {
        const postId = ctx.params.id;
        return await this.queries.getSinglePost(postId);
    }

    public async getAllPosts() {
        return await this.queries.getAllUsersPosts();
    }

    public async updatePost(ctx: HttpContextContract) {
        const postId = ctx.params.id;
        const body = ctx.request.all();

        const post = await this.queries.getSinglePost(postId);

        if (!post)
            throw new Exception("Post Not Found!", 404, "E_INVALID_REQUEST");

        return await this.queries.updatePost(postId, body);
    }

    public async deletePost(ctx: HttpContextContract) {
        const postId = ctx.params.id;

        const post = await this.queries.getSinglePost(postId);

        if (!post)
            throw new Exception("Post Not Found!", 404, "E_INVALID_REQUEST");

        return await this.queries.deletePost(postId);
    }

    //Roles
    public async showAllRoles(ctx:HttpContextContract){

    }

    public async showAllRolesWithUsers(ctx:HttpContextContract){
        
    }
}
