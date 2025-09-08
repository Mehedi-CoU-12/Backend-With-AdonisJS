import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export class CreateWebinarValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    webinar_details: schema.object().members({
      title: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(255),
      ]),
      details: schema.string({ trim: true }, [
        rules.minLength(10),
        rules.maxLength(5000),
      ]),
      host_image_url: schema.string({ trim: true }, [rules.url()]),
      start_time: schema.string({}, [
        rules.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/),
      ]),
      end_time: schema.string.optional({}, [
        rules.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/),
      ]),
    }),
    webinar_about: schema.object().members({
      about: schema.string({ trim: true }, [
        rules.minLength(10),
        rules.maxLength(2000),
      ]),
      webinar_image_url: schema.string({ trim: true }, [rules.url()]),
      learning: schema.array().members(
        schema.object().members({
          topic: schema.string({ trim: true }, [
            rules.minLength(1),
            rules.maxLength(200),
          ]),
          details: schema.string({ trim: true }, [
            rules.minLength(1),
            rules.maxLength(500),
          ]),
          icon_url: schema.string({ trim: true }, [rules.url()]),
        })
      ),
    }),
    agenda: schema.array().members(
      schema.object().members({
        topic: schema.string({ trim: true }, [
          rules.minLength(1),
          rules.maxLength(200),
        ]),
        details: schema.string({ trim: true }, [
          rules.minLength(1),
          rules.maxLength(1000),
        ]),
        icon_url: schema.string({ trim: true }, [rules.url()]),
      })
    ),
    speaker: schema.array().members(
      schema.object().members({
        first_name: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(50),
        ]),
        last_name: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(50),
        ]),
        image_url: schema.string({ trim: true }, [rules.url()]),
        designation: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(100),
        ]),
        about: schema.string({ trim: true }, [
          rules.minLength(10),
          rules.maxLength(1000),
        ]),
      })
    ),
    creator: schema.array().members(
      schema.object().members({
        first_name: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(50),
        ]),
        last_name: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(50),
        ]),
        image_url: schema.string({ trim: true }, [rules.url()]),
        designation: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(100),
        ]),
        speach: schema.string({ trim: true }, [
          rules.minLength(10),
          rules.maxLength(1500),
        ]),
      })
    ),
  });

  public messages: CustomMessages = {
    "title.required": "Webinar title is required",
    "title.minLength": "Title must be at least 3 characters long",
    "title.maxLength": "Title must not exceed 255 characters",
    "details.required": "Webinar details are required",
    "details.minLength": "Details must be at least 10 characters long",
    "details.maxLength": "Details must not exceed 5000 characters",
    "imageUrl.url": "Image URL must be a valid URL",
    "agenda.required": "Webinar agenda is required",
    "agenda.array": "Agenda must be an array of agenda items",
    "agenda.*.title.required": "Agenda item title is required",
    "agenda.*.title.minLength":
      "Agenda item title must be at least 1 character long",
    "agenda.*.title.maxLength":
      "Agenda item title must not exceed 200 characters",
    "agenda.*.details.required": "Agenda item details are required",
    "agenda.*.details.minLength":
      "Agenda item details must be at least 1 character long",
    "agenda.*.details.maxLength":
      "Agenda item details must not exceed 1000 characters",
    "speakers.required": "At least one speaker is required",
    "speakers.array": "Speakers must be an array of speaker objects",
    "speakers.*.first_name.required": "Speaker first name is required",
    "speakers.*.first_name.minLength":
      "Speaker first name must be at least 2 characters long",
    "speakers.*.first_name.maxLength":
      "Speaker first name must not exceed 50 characters",
    "speakers.*.last_name.required": "Speaker last name is required",
    "speakers.*.last_name.minLength":
      "Speaker last name must be at least 2 characters long",
    "speakers.*.last_name.maxLength":
      "Speaker last name must not exceed 50 characters",
    "speakers.*.designation.required": "Speaker designation is required",
    "speakers.*.designation.minLength":
      "Speaker designation must be at least 2 characters long",
    "speakers.*.designation.maxLength":
      "Speaker designation must not exceed 100 characters",
    "speakers.*.about.required": "Speaker about section is required",
    "speakers.*.about.minLength":
      "Speaker about section must be at least 10 characters long",
    "speakers.*.about.maxLength":
      "Speaker about section must not exceed 1000 characters",
    "speakers.*.image_url.url": "Speaker image URL must be a valid URL",
    "startTime.required": "Start time is required",
    "startTime.regex":
      "Start time must be in ISO 8601 format (e.g., 2024-01-01T10:00:00Z)",
    "endTime.regex":
      "End time must be in ISO 8601 format (e.g., 2024-01-01T11:00:00Z)",
  };
}

export class RegisterParticipantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(50),
    ]),
    lastName: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(50),
    ]),
    email: schema.string({ trim: true }, [rules.email(), rules.maxLength(255)]),
  });

  public messages: CustomMessages = {
    "firstName.required": "First name is required",
    "firstName.minLength": "First name must be at least 2 characters long",
    "firstName.maxLength": "First name must not exceed 50 characters",
    "lastName.required": "Last name is required",
    "lastName.minLength": "Last name must be at least 2 characters long",
    "lastName.maxLength": "Last name must not exceed 50 characters",
    "email.required": "Email address is required",
    "email.email": "Please provide a valid email address",
    "email.maxLength": "Email must not exceed 255 characters",
  };
}

export class VerifyOtpValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    otp: schema.string({ trim: true }, [
      rules.regex(/^\d{6}$/), // Exactly 6 digits
    ]),
  });

  public messages: CustomMessages = {
    "email.required": "Email address is required",
    "email.email": "Please provide a valid email address",
    "otp.required": "OTP code is required",
    "otp.regex": "OTP must be exactly 6 digits",
  };
}

export class WebinarIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.unsigned()]),
  });

  public messages: CustomMessages = {
    "id.required": "Webinar ID is required",
    "id.number": "Webinar ID must be a valid number",
    "id.unsigned": "Webinar ID must be a positive number",
  };
}

export class UpdateWebinarValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    topic: schema.string.optional({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    agenda: schema.string.optional({ trim: true }, [
      rules.minLength(10),
      rules.maxLength(5000),
    ]),
    startTime: schema.string.optional({}, [
      rules.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/), // ISO 8601 format
    ]),
    endTime: schema.string.optional({}, [
      rules.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/), // ISO 8601 format
    ]),
    cfMeetingId: schema.string.optional({ trim: true }),
  });

  public messages: CustomMessages = {
    "topic.minLength": "Topic must be at least 3 characters long",
    "topic.maxLength": "Topic must not exceed 255 characters",
    "agenda.minLength": "Agenda must be at least 10 characters long",
    "agenda.maxLength": "Agenda must not exceed 5000 characters",
    "startTime.regex":
      "Start time must be in ISO 8601 format (e.g., 2024-01-01T10:00:00Z)",
    "endTime.regex":
      "End time must be in ISO 8601 format (e.g., 2024-01-01T11:00:00Z)",
  };
}