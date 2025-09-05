import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| UserNotFoundException
|--------------------------------------------------------------------------
|
| Custom exception for when a user is not found
| This will be caught by the Global Exception Handler automatically!
|
*/

export default class UserNotFoundException extends Exception {
  constructor(message?: string, identifier?: string | number) {
    super(
      message || `User ${identifier ? `with ${identifier}` : ''} not found`,
      404,
      'E_USER_NOT_FOUND'
    )
  }
}
