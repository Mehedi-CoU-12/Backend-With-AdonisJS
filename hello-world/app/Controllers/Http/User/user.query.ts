import User from "App/Models/User";

export default class UserQuery {
  public static async findByEmail(email: string) {
    return User.findBy("email", email);
  }

  public static async createUser(data: Partial<User>) {
    return User.create(data);
  }
}
