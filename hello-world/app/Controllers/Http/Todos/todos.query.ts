import Todo from "App/Models/Todo";

export default class TodoQuery {
  public static async getAll() {
    return Todo.query()
  }

  public static async findById(id: number) {
    return Todo.find(id)
  }

  public static async create(data: Partial<Todo>) {
    return Todo.create(data)
  }

  public static async update(todo: Todo, data: Partial<Todo>) {
    todo.merge(data)
    await todo.save()
    return todo
  }

  public static async delete(todo: Todo) {
    await todo.delete()
    return true
  }
}

