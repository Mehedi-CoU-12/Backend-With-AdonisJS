import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| TodoNotFoundException
|--------------------------------------------------------------------------
|
| Custom exception for when a todo item is not found
| This will be caught by the Global Exception Handler automatically!
|
*/

export default class TodoNotFoundException extends Exception {
  constructor(message?: string, todoId?: number) {
    super(
      message || `Todo ${todoId ? `with ID ${todoId}` : ''} not found`,
      404,
      'E_TODO_NOT_FOUND'
    )
  }
}
