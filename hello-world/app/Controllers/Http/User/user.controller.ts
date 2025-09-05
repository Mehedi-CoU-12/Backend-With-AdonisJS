import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { LoginValidator, RegisterValidator } from "./user.validator";
import Services from "./user.service";

export default class Controllers {
  public async register({ request, auth }: HttpContextContract) {
    const payload = await request.validate({ schema: RegisterValidator }); // Auto throws validation errors
    const result = await Services.register(auth, payload);
    return { success: true, data: result, message: "User registered successfully" };
  }

  public async login({ request, auth }: HttpContextContract) {
    const payload = await request.validate({ schema: LoginValidator }); // Auto throws validation errors
    const result = await Services.login(auth, payload.email, payload.password);
    return { success: true, data: result, message: "Login successful" };
  }
}
