import { schema } from "@ioc:Adonis/Core/Validator"

export const TodoValidator = schema.create({
  title: schema.string(),
  desc: schema.string.optional(),
  done: schema.boolean.optional(),
})
