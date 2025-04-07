import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Checkbox, Input } from "../types";

export default function CustomCheckbox({
  field,
  register,
  errors,
}: {
  field: Checkbox | Input;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  return (
    <div key={field.label} className="flex flex-col gap-2 items-start relative">
      <label className="text-black font-medium">{field.label}</label>
      <input
        type="checkbox"
        className="border border-black  px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register(field.prop, {
          required:
            field.validation.required && `Accepeting this field is required`,
        })}
      />
      <div className="min-h-[20px] ">
        {errors[field.prop] && (
          <span className="text-red-500 absolute">
            {errors[field.prop]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
}
