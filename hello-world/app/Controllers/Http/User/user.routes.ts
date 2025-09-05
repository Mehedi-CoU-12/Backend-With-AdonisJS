import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("register", "user.controller.register");
  Route.post("login", "user.controller.login");
})
  .prefix("api")
  .namespace("App/Controllers/Http/User");
