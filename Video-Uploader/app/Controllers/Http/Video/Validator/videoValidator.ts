import { schema, rules } from "@ioc:Adonis/Core/Validator";

// Validator for creating a new video (upload from URL)
export const CreateVideoValidator = schema.create({
  url: schema.string({}, [
    rules.url({
      protocols: ['http', 'https'],
      requireTld: true,
      requireProtocol: true
    }),
    rules.maxLength(2048)
  ]),
  title: schema.string.optional({}, [
    rules.maxLength(255),
    rules.minLength(1)
  ]),
  // Optional fields that might be sent to Bunny.net
  thumbnailTime: schema.number.optional([
    rules.unsigned()
  ]),
  collectionId: schema.string.optional({}, [
    rules.uuid()
  ])
});

// Validator for updating video information
export const UpdateVideoValidator = schema.create({
  title: schema.string.optional({}, [
    rules.maxLength(255),
    rules.minLength(1)
  ]),
  // Other optional fields for video updates
  thumbnailTime: schema.number.optional([
    rules.unsigned()
  ]),
  collectionId: schema.string.optional({}, [
    rules.uuid()
  ])
});

// Validator for video ID parameter
export const VideoIdValidator = schema.create({
  id: schema.string({}, [
    rules.uuid()
  ])
});

// Validator for webhook data from Bunny.net
export const WebhookValidator = schema.create({
  VideoGuid: schema.string({}, [
    rules.uuid()
  ]),
  Status: schema.number([
    rules.unsigned(),
    rules.range(0, 10) // Bunny.net statuses are typically 0-5
  ]),
  // Optional webhook fields
  VideoLibraryId: schema.number.optional(),
  Title: schema.string.optional(),
  Length: schema.number.optional(),
  VideoUrl: schema.string.optional(),
  ThumbnailUrl: schema.string.optional(),
  PreviewUrl: schema.string.optional()
});
