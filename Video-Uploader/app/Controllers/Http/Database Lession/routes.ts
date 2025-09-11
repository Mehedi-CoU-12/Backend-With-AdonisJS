import Route from "@ioc:Adonis/Core/Route";
Route.group(() => {
    //user
    Route.get("/get-single-user/:id", "controller.getSingleUser");
    Route.get("/get-all-users", "controller.getAllUsers");
    Route.post("/create-user", "controller.createUser");
    Route.post("/delete-user","controller.deleteUser");
    Route.post("/update-user/:id","controller.updateUser");

    //profile
    Route.get("/get-single-profile/:id", "controller.getSingleProfile");
    Route.get("/get-all-profiles", "controller.getAllProfiles");
    Route.post("/update-profile/:id","controller.updateProfile");
})
    .prefix("/api/v1/user")
    .namespace("App/Controllers/Http/Database Lession");
