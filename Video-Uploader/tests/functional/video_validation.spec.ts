import { test } from '@japa/runner'
import { 
  CreateVideoValidator, 
  UpdateVideoValidator, 
  VideoIdValidator, 
  WebhookValidator 
} from 'App/Controllers/Http/Video/Validator/videoValidator'

test.group('Video Validation Tests', () => {
  
  test('CreateVideoValidator should validate valid video data', async ({ assert }) => {
    const validData = {
      url: 'https://example.com/video.mp4',
      title: 'Test Video',
      thumbnailTime: 30,
    }
    
    // This should not throw any validation errors
    const result = CreateVideoValidator.validate(validData)
    assert.isObject(result)
  })
  
  test('CreateVideoValidator should reject invalid URL', async ({ assert }) => {
    const invalidData = {
      url: 'not-a-valid-url',
      title: 'Test Video',
    }
    
    try {
      CreateVideoValidator.validate(invalidData)
      // Should not reach here
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isObject(error.messages)
    }
  })
  
  test('UpdateVideoValidator should validate optional fields', async ({ assert }) => {
    const validData = {
      title: 'Updated Video Title',
    }
    
    // This should not throw any validation errors
    const result = UpdateVideoValidator.validate(validData)
    assert.isObject(result)
  })
  
  test('VideoIdValidator should validate UUID', async ({ assert }) => {
    const validData = {
      id: '123e4567-e89b-12d3-a456-426614174000'
    }
    
    // This should not throw any validation errors
    const result = VideoIdValidator.validate(validData)
    assert.isObject(result)
  })
  
  test('VideoIdValidator should reject invalid UUID', async ({ assert }) => {
    const invalidData = {
      id: 'not-a-uuid'
    }
    
    try {
      VideoIdValidator.validate(invalidData)
      // Should not reach here
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isObject(error.messages)
    }
  })
  
  test('WebhookValidator should validate webhook data', async ({ assert }) => {
    const validData = {
      VideoGuid: '123e4567-e89b-12d3-a456-426614174000',
      Status: 3,
      VideoLibraryId: 12345,
      Title: 'Processed Video'
    }
    
    // This should not throw any validation errors  
    const result = WebhookValidator.validate(validData)
    assert.isObject(result)
  })
  
  test('WebhookValidator should reject invalid status', async ({ assert }) => {
    const invalidData = {
      VideoGuid: '123e4567-e89b-12d3-a456-426614174000',
      Status: -1, // Invalid negative status
    }
    
    try {
      WebhookValidator.validate(invalidData)
      // Should not reach here
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isObject(error.messages)
    }
  })
})
