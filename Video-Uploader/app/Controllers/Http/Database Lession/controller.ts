import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Queries from "./query";

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
        const { id } = ctx.params.id;
        return  await this.queries.getUserById(id);
    }

    public async getAllUsers() {
        return  await this.queries.getAllUsers();
    }

    public async updateUser(ctx: HttpContextContract) {
        const {email,password} = ctx.request.all();
        const id = ctx.params.id;

        return await this.queries.updateUser(id,{email,password});
    }

    public async deleteUser(ctx:HttpContextContract) {
        const id=ctx.params.id;
        return await this.queries.deleteUser(id);
    }

    //profile 
    public async getSingleProfile(ctx: HttpContextContract) {
        const { id } = ctx.params.id;
        return  await this.queries.getProfileById(id);
    }

    public async getAllProfiles() {
        return  await this.queries.getAllProfiles();
    }

    public async updateProfile(ctx:HttpContextContract){
        const id=ctx.params.id;
        const body=ctx.request.all();

        return await this.queries.updateProfile(id,body);
    }
}
