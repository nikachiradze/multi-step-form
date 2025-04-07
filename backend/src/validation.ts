import { Schema, z, ZodType, ZodTypeAny } from "zod";
import form from "./data/form.json";
import { Field, Input, Validation, Step, SelectWithCustomInput } from "./types";

const object = {};

// Object with props : [...validations]
export const buildValidationObject = () => {
  const data = form;
  let resultObject: Record<string, Validation[]> = {};

  data.forEach((step) => {
    step.fields.forEach((field: Field) => {
      const { prop, validation } = field;
      resultObject[prop] = [validation];
      if (field.type === "select") {
        const fld = field as SelectWithCustomInput;
        if (fld.allowCustomInput) {
          //   console.log(fld.customInput);
          resultObject[prop] = [
            ...resultObject[prop],
            fld.customInput.validation,
          ];
        }
      }
    });
  });

  return resultObject;
};

export const buildSchema = () => {
  const object = buildValidationObject();
  //   console.log(object);
  const result: Record<string, ZodTypeAny | undefined> = {};

  for (const key of Object.keys(object)) {
    const rules = object[key];
    if (rules.length === 1) {
      const validationRule = rules[0];
      const schema = validateInputTypes(validationRule);
      result[key] = schema;
    }
    if (rules.length === 2) {
      const rule1 = rules[0];
      const rule2 = rules[1];
      const schema1 = validateInputTypes(rule1);
      const schema2 = validateInputTypes(rule2);
      if (schema1 && schema2) {
        const unionSchema = z.union([schema1, schema2]);
        result[key] = unionSchema;
      }
    }
  }
  return result;
};

const validateInputTypes = (validation: Validation) => {
  if (validation.type === "string") {
    let schema = z
      .string({ required_error: "This field is required" })
      .min(2, "Invalid Input");
    if (validation.minLength) {
      schema = schema.min(validation.minLength);
    }
    if (validation.required) {
      return schema;
    } else {
      return schema.nullable().optional();
    }
  }
  if (validation.type === "number") {
    let schema = z.number();
    if (validation.min) {
      schema = schema.min(validation.min);
    }
    if (validation.required) {
      return schema;
    } else {
      return schema.nullable().optional();
    }
  }
  if (validation.type === "email") {
    let schema = z
      .string({ required_error: "This field is required" })
      .email("Invalid email format");
    if (validation.required) {
      return schema;
    } else {
      return schema.nullable().optional();
    }
  }
  if (validation.type === "boolean") {
    let schema = z.literal(true);
    if (validation.required) {
      return schema;
    } else {
      return schema.optional();
    }
  }
};

export function validaTeSchool() {
  const obj = buildValidationObject();

  //   console.log(obj);
  //   console.log(obj["school"]);
}
