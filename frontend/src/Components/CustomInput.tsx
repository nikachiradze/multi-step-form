import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "../types";
type CustomInputProps = {
  field: Input;
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

export default function CustomInput({
  field,
  register,
  errors,
}: CustomInputProps) {
  return (
    <div key={field.label} className="flex flex-col  relative">
      <label className="text-black font-medium">{field.label}</label>
      <input
        placeholder={field.placeholder}
        type={field.subType ?? "text"}
        className="border border-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register(field.prop, {
          required: field.validation.required && `${field.prop} is required`,
          valueAsNumber: field.subType === "number",
          minLength: field.validation.minLength && {
            value: field.validation.minLength,
            message: `${field.prop} should be at least ${field.validation.minLength} characters long`,
          },
          min: field.validation.min && {
            value: field.validation.min,
            message: `${field.prop} should be at least ${field.validation.min}`,
          },
        })}
      />
      <div className="min-h-[20px]">
        {errors[field.prop] && (
          <span className="text-red-500 absolute">
            {errors[field.prop]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
}
