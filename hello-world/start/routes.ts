import Route from "@ioc:Adonis/Core/Route";
import "../app/Controllers/Http/Todos/todos.routes";
import "../app/Controllers/Http/User/user.routes";

Route.get("/", async () => {
  return { hello: "world" };
});


Route.post('add-to-cart', async ({ request, response }) => {
  /**
   * Read cookie by name
   */

  const existingItems = request.cookie('cart-items', [])

  /**
   * Set/update cookie
   */
  const newItems = existingItems.concat([{ id: 10 }])


  response.cookie('cart-items', newItems)

  return {success:true,cookiesValue:newItems};
})

Route.delete('clear-cart', async ({ response }) => {
  /**
   * Clear cookie
   */
  response.clearCookie('cart-items')
})
