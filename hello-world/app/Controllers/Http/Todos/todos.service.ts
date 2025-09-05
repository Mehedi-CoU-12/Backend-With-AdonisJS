import Todo from "App/Models/Todo"
import TodoQuery from "./todos.query"

export default class TodoService {
    
  public static async listTodos() {
    return TodoQuery.getAll()
  }

  public static async getTodoById(id: number) {
    return TodoQuery.findById(id)
  }

  public static async createTodo(data: Partial<Todo>) {
    return TodoQuery.create(data)
  }

  public static async updateTodo(id: number, data: Partial<Todo>) {
    const todo = await TodoQuery.findById(id)
    if (!todo) return null
    return TodoQuery.update(todo, data)
  }

  public static async deleteTodo(id: number) {
    const todo = await TodoQuery.findById(id)
    if (!todo) return false
    await TodoQuery.delete(todo)
    return true
  }
}
