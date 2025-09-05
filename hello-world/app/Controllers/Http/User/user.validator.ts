import { schema, rules } from "@ioc:Adonis/Core/Validator";

export const RegisterValidator = schema.create({
  email: schema.string({}, [
    rules.email(),
    rules.unique({ table: "users", column: "email" }),
  ]),
  password: schema.string(),
  name: schema.string(),
});

export const LoginValidator = schema.create({
  email: schema.string({}, [rules.email()]),
  password: schema.string(),
});
