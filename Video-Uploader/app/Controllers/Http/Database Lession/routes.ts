import Route from "@ioc:Adonis/Core/Route";
Route.group(() => {
    //user
    Route.get("/get-single-user/:id", "controller.getSingleUser");
    Route.get("/get-all-users", "controller.getAllUsers");
    Route.post("/create-user", "controller.createUser");
    Route.post("/delete-user/:id","controller.deleteUser");
    Route.post("/update-user/:id","controller.updateUser");

    Route.get('/get-single-user-roles/:id',"controller");

    //profile
    Route.get("/get-single-profile/:id", "controller.getSingleProfile");
    Route.get("/get-single-profile-user/:id", "controller.getSingleProfileWithUser");
    Route.get("/get-all-profiles", "controller.getAllProfiles");
    Route.get("/get-all-profiles-users", "controller.getAllProfilesWithUsers");
    Route.post("/update-profile/:id","controller.updateProfile");

    //post
    Route.get("/get-single-user-post/:id", "controller.getUserPosts");
    Route.get("get-single-post/:id","controller.getSinglePost")
    Route.get("/get-all-posts", "controller.getAllPosts");
    Route.post("/create-post/:id", "controller.createPost");
    Route.post("/delete-post/:id","controller.deletePost");
    Route.post("/update-post/:id","controller.updatePost");

    //roles
    Route.get('/get-all-roles','controller.showAllRoles');
    Route.get('/get-all-roles-users','controller.getAllRolesWithUsers');
    Route.get('/get-single-role/:id','controller');
    Route.get('/get-single-role-users/:id','controller.getSingleRoleWithUsers');
    Route.post('/create-role','controller.createRole');
    Route.post('/assigned-role','controller.assingnedRolesToUser')
    Route.post('/update-role/:id','controller');
    Route.post('/delete-role/:id','controller');

})
    .prefix("/api/v1/user")
    .namespace("App/Controllers/Http/Database Lession");
