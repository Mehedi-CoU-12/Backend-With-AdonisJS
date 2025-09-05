/*
|--------------------------------------------------------------------------
| Http Exception Handler - Your Global Error Superhero! 🦸‍♂️
|--------------------------------------------------------------------------
|
| This handles ALL errors in your AdonisJS app automatically!
| No need for try-catch everywhere - just throw errors and this handles them.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  /**
   * Handle all exceptions and return user-friendly responses
   */
  public async handle(error: any, ctx: HttpContextContract) {
    const { response } = ctx

    /**
     * 🔐 Authentication Errors
     */
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return response.status(401).json({
        success: false,
        message: 'You must be logged in to access this resource',
        error_code: 'UNAUTHORIZED'
      })
    }

    /**
     * ✅ Validation Errors (from your validators)
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return response.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.messages,
        error_code: 'VALIDATION_ERROR'
      })
    }

    /**
     * 🗃️ Database Errors
     */
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23000') {
      return response.status(409).json({
        success: false,
        message: 'This record already exists',
        error_code: 'DUPLICATE_ENTRY'
      })
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === '23000') {
      return response.status(400).json({
        success: false,
        message: 'Referenced record does not exist',
        error_code: 'FOREIGN_KEY_ERROR'
      })
    }

    /**
     * 🔍 Route Not Found (404)
     */
    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return response.status(404).json({
        success: false,
        message: 'The requested resource was not found',
        error_code: 'NOT_FOUND'
      })
    }

    /**
     * 🚫 HTTP Method Not Allowed (405)
     */
    if (error.code === 'E_HTTP_REQUEST_METHOD_NOT_ALLOWED') {
      return response.status(405).json({
        success: false,
        message: 'HTTP method not allowed for this route',
        error_code: 'METHOD_NOT_ALLOWED'
      })
    }

    /**
     * 📝 Custom Application Errors (we'll create these next!)
     */
    if (error.code === 'E_TODO_NOT_FOUND') {
      return response.status(404).json({
        success: false,
        message: 'Todo not found',
        error_code: 'TODO_NOT_FOUND'
      })
    }

    if (error.code === 'E_USER_NOT_FOUND') {
      return response.status(404).json({
        success: false,
        message: 'User not found',
        error_code: 'USER_NOT_FOUND'
      })
    }

    /**
     * 🔥 Development vs Production Error Handling
     */
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Log all errors for debugging
    Logger.error('Unhandled Exception:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      status: error.status
    })

    /**
     * 💥 Unknown/Unexpected Errors
     */
    return response.status(error.status || 500).json({
      success: false,
      message: isDevelopment 
        ? error.message 
        : 'Something went wrong. Please try again later.',
      error_code: 'INTERNAL_ERROR',
      ...(isDevelopment && { 
        stack: error.stack,
        details: error 
      })
    })
  }

  /**
   * Report exceptions (for logging, monitoring, etc.)
   */
  public async report(error: any, ctx: HttpContextContract) {
    // You can send errors to external services like Sentry, Bugsnag, etc.
    if (!this.shouldntReport(error)) {
      Logger.error('Exception reported:', {
        message: error.message,
        stack: error.stack,
        url: ctx.request.url(),
        method: ctx.request.method(),
        user: ctx.auth?.user?.id || 'anonymous'
      })
    }
  }

  /**
   * Don't report certain errors (like validation errors)
   */
  private shouldntReport(error: any): boolean {
    const dontReport = [
      'E_VALIDATION_FAILURE',
      'E_UNAUTHORIZED_ACCESS',
      'E_ROUTE_NOT_FOUND'
    ]
    
    return dontReport.includes(error.code)
  }
}
