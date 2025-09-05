import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TodoService from "./todos.service";
import { TodoValidator } from "./todos.validator";
import TodoNotFoundException from "App/Exceptions/TodoNotFoundException";

export default class TodosController {
  public async index(): Promise<{ success: boolean; data: any[] }> {
    const todos = await TodoService.listTodos();
    return { success: true, data: todos };
  }

  public async show({ params }: HttpContextContract) {
    const todo = await TodoService.getTodoById(params.id);
    if (!todo) {
      throw new TodoNotFoundException(undefined, params.id);
    }
    return { success: true, data: todo };
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await auth.authenticate(); // Throws E_UNAUTHORIZED_ACCESS if not logged in
    const payload = await request.validate({ schema: TodoValidator }); // Throws E_VALIDATION_FAILURE if invalid
    const todo = await TodoService.createTodo(payload);
    return response.status(201).json({ success: true, data: todo, message: "Todo created successfully" });
  }

  public async update({ request, params }: HttpContextContract) {
    const payload = await request.validate({ schema: TodoValidator });
    const todo = await TodoService.updateTodo(params.id, payload);
    if (!todo) {
      throw new TodoNotFoundException(undefined, params.id);
    }
    return { success: true, data: todo, message: "Todo updated successfully" };
  }

  public async destroy({ params }: HttpContextContract) {
    const deleted = await TodoService.deleteTodo(params.id);
    if (!deleted) {
      throw new TodoNotFoundException(undefined, params.id);
    }
    return { success: true, message: "Todo deleted successfully" };
  }
}
