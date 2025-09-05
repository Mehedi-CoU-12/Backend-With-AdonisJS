import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/get-all-video", "video.controller.index");
  Route.get("/get-single-video/:id", "video.controller.show");
  Route.post("/create", "video.controller.store");
  Route.put("/update/:id", "video.controller.update");
  Route.delete("/delete/:id", "video.controller.destroy");
}).prefix("library/:libraryId");
