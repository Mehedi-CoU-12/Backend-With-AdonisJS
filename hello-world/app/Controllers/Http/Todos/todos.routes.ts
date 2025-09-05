import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("todos", "todos.controller.index");
  Route.get("todos/:id", "todos.controller.show");
  Route.post("todos", "todos.controller.store");
  Route.put("todos/:id", "todos.controller.update");
  Route.delete("todos/:id", "todos.controller.destroy");
})
  .prefix("api")
  .namespace("App/Controllers/Http/Todos")
  .middleware("auth:api");
