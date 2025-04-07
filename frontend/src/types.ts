export type Validation = {
  type: "string" | "number" | "boolean" | "email";
  minLength?: number;
  min?: number;
  required?: boolean;
  validValues?: any[];
};

type BaseField = {
  prop: string;
  label: string;
  placeholder: string;
  validation: Validation;
};

export type Input = BaseField & {
  type: "input" | "checkbox";
  subType?: "text" | "email" | "number" | "password";
};

export type SelectType = BaseField & {
  type: "select";
  collection: string;
  allowCustomInput: false;
};

export type SelectWithCustomInput = BaseField & {
  type?: "select";
  collection: string;
  allowCustomInput: true;
  customInputOption?: string;
  customInput: Omit<Input, "prop" | "type">;
};

export type Checkbox = BaseField & {
  type: "checkbox";
};

export type Field = Input | SelectType | SelectWithCustomInput | Checkbox;

export type Step = {
  title: string;
  fields: Field[];
};
