import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/create", "videoController.store");
  Route.get("/get-all-video", "videoController.index");
  Route.get("/get-single-video/:id", "videoController.show");
  Route.put("/update/:id", "videoController.update");
  Route.delete("/delete/:id", "videoController.destroy");

  //web hook
  Route.post('/bunny-webhook',"videoController");

})
  .prefix("api/v1")
  .namespace("App/Controllers/Http/Video/Controller");
