import { AuthContract } from "@ioc:Adonis/Addons/Auth";

import User from "App/Models/User";
import UserQuery from "./user.query";

export default class Services {
  public static async register(auth: AuthContract, data: Partial<User>) {
    const user = await UserQuery.createUser(data);
    const token = await auth.use("api").login(user, { expiresIn: "10 days" });
    return token.toJSON();
  }

  public static async login(
    auth: AuthContract,
    email: string,
    password: string
  ) {
    const token = await auth
      .use("api")
      .attempt(email, password, { expiresIn: "10 days" });
    return token.toJSON();
  }
}
