import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Controller {
  public async index(): Promise<{ success: boolean; data: any[] }> {    }

  public async show({ params }: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {}

  public async update({ request, params }: HttpContextContract) {}

  public async destroy({ params }: HttpContextContract) {}
}
