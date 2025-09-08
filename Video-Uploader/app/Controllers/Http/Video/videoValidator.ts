import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export class CreateVideoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    url:schema.string([rules.url({
      protocols:['http','https'],
      requireTld:true,
      requireProtocol:true
    }),rules.maxLength(2048)]),

    title: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
      rules.minLength(1)
    ]),
    // Optional fields that might be sent to Bunny.net
    thumbnailTime: schema.number.optional([
      rules.unsigned(),
      rules.range(0, 86400) // Max 24 hours in seconds
    ]),
    collectionId: schema.string.optional({ trim: true }, [
      rules.uuid()
    ]),
  });

  public messages: CustomMessages = {
    "url.required": "The video URL is required",
    "url.string": "The video URL must be a valid string",
    "url.url": "Please provide a valid HTTP or HTTPS URL",
    
    "title.string": "The video title must be a valid string",
    "title.minLength": "The video title must be at least 1 character long",
    "title.maxLength": "The video title must not exceed 255 characters",
    
    "thumbnailTime.number": "Thumbnail time must be a valid number",
    "thumbnailTime.unsigned": "Thumbnail time must be a positive number",
    "thumbnailTime.range": "Thumbnail time must be between 0 and 86400 seconds (24 hours)",
    
    "collectionId.string": "Collection ID must be a valid string",
    "collectionId.uuid": "Collection ID must be a valid UUID format"
  };
}

export class UpdateVideoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
      rules.minLength(1)
    ]),
    // Other optional fields for video updates
    thumbnailTime: schema.number.optional([
      rules.unsigned(),
      rules.range(0, 86400) // Max 24 hours in seconds
    ]),
    collectionId: schema.string.optional({ trim: true }, [
      rules.uuid()
    ])
  });

  public messages: CustomMessages = {
    "title.string": "The video title must be a valid string",
    "title.minLength": "The video title must be at least 1 character long",
    "title.maxLength": "The video title must not exceed 255 characters",
    
    "thumbnailTime.number": "Thumbnail time must be a valid number",
    "thumbnailTime.unsigned": "Thumbnail time must be a positive number",
    "thumbnailTime.range": "Thumbnail time must be between 0 and 86400 seconds (24 hours)",
    
    "collectionId.string": "Collection ID must be a valid string",
    "collectionId.uuid": "Collection ID must be a valid UUID format"
  };
}

export class VideoIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.string({ trim: true }, [
      rules.uuid()
    ])
  });

  public messages: CustomMessages = {
    "id.required": "Video ID is required",
    "id.string": "Video ID must be a valid string",
    "id.uuid": "Video ID must be a valid UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)"
  };
}


export class WebhookValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    VideoGuid: schema.string({ trim: true }, [
      rules.uuid()
    ]),
    Status: schema.number([
      rules.unsigned(),
      rules.range(0, 10) 
    ]),
    // Optional webhook fields from Bunny.net
    VideoLibraryId: schema.number.optional([
      rules.unsigned()
    ]),
    Title: schema.string.optional({ trim: true }, [
      rules.maxLength(500)
    ]),
    Length: schema.number.optional([
      rules.unsigned()
    ]),
    VideoUrl: schema.string.optional({ trim: true }, [
      rules.url(),
      rules.maxLength(2048)
    ]),
    ThumbnailUrl: schema.string.optional({ trim: true }, [
      rules.url(),
      rules.maxLength(2048)
    ]),
    PreviewUrl: schema.string.optional({ trim: true }, [
      rules.url(),
      rules.maxLength(2048)
    ]),
    // Additional metadata fields
    category: schema.string.optional({ trim: true }, [
      rules.maxLength(100)
    ]),
    playLink: schema.string.optional({ trim: true }, [
      rules.url(),
      rules.maxLength(2048)
    ])
  });

  public messages: CustomMessages = {
    "VideoGuid.required": "Video GUID is required for webhook processing",
    "VideoGuid.string": "Video GUID must be a valid string",
    "VideoGuid.uuid": "Video GUID must be a valid UUID format",
    
    "Status.required": "Processing status is required",
    "Status.number": "Processing status must be a valid number",
    "Status.unsigned": "Processing status must be a positive number",
    "Status.range": "Processing status must be between 0 and 10",
    
    "VideoLibraryId.number": "Video library ID must be a valid number",
    "VideoLibraryId.unsigned": "Video library ID must be a positive number",
    
    "Title.string": "Video title must be a valid string",
    "Title.maxLength": "Video title must not exceed 500 characters",
    
    "Length.number": "Video length must be a valid number",
    "Length.unsigned": "Video length must be a positive number",
    
    "VideoUrl.string": "Video URL must be a valid string",
    "VideoUrl.url": "Video URL must be a valid URL format",
    "VideoUrl.maxLength": "Video URL must not exceed 2048 characters",
    
    "ThumbnailUrl.string": "Thumbnail URL must be a valid string",
    "ThumbnailUrl.url": "Thumbnail URL must be a valid URL format",
    "ThumbnailUrl.maxLength": "Thumbnail URL must not exceed 2048 characters",
    
    "PreviewUrl.string": "Preview URL must be a valid string",
    "PreviewUrl.url": "Preview URL must be a valid URL format",
    "PreviewUrl.maxLength": "Preview URL must not exceed 2048 characters",
    
    "category.string": "Video category must be a valid string",
    "category.maxLength": "Video category must not exceed 100 characters",
    
    "playLink.string": "Play link must be a valid string",
    "playLink.url": "Play link must be a valid URL format",
    "playLink.maxLength": "Play link must not exceed 2048 characters"
  };
}
