type FormType = {
  name: string;
  surname: string;
  city: number;
  school: string;
  age: number | null;
  mail: string;
  password: string;
  termsAndConditions: boolean;
};

export type Validation = {
  type: string;
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
  type: string;
  subType?: string;
};

export type SelectType = BaseField & {
  type: string;
  collection: string;
  allowCustomInput: false;
};

export type SelectWithCustomInput = BaseField & {
  type: string;
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
