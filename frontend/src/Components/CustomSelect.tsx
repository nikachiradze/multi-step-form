import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SelectWithCustomInput } from "../types";
import { useCallback, useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function CustomSelect({
  field,
  register,
  errors,
  selectedDependency,
  disabled,
  selected,
  setFail,
}: {
  field: SelectWithCustomInput;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  selectedDependency: string | null;
  disabled: boolean;
  selected: string;
  setFail: (val: boolean) => void;
}) {
  const customProp = "custom" + field.label;

  const [collection, setCollection] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const response = await fetch(
      `http://localhost:9000/${field.collection}/${selectedDependency}`
    );
    const data = await response.json();
    return data;
  }, [field.collection, selectedDependency]);

  useEffect(() => {
    if (selectedDependency && selectedDependency !== "other") {
      setIsLoading(true);
      console.log(selectedDependency);

      fetchData()
        .then((data) => {
          setCollection(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setFail(true);
          console.error(error);
        });
    }
  }, [selectedDependency, fetchData, setFail]);

  return (
    <div key={field.label} className="flex flex-col  relative">
      <label className="text-black font-medium">{field.label}</label>
      {isLoading ? (
        <div className="border border-black px-4 py-1 rounded-lg">
          <Spinner />
          <select
            hidden
            disabled={disabled}
            className="border border-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register(field.prop, {
              required:
                field.validation.required && `${field.prop} is required`,
            })}
          >
            <option value="">{field.placeholder}</option>
          </select>
        </div>
      ) : (
        <>
          <select
            disabled={disabled}
            className="border border-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register(field.prop, {
              required:
                field.validation.required && `${field.prop} is required`,
            })}
          >
            <option value="">{field.placeholder}</option>
            {field.allowCustomInput && (
              <option value="other">{field.customInputOption}</option>
            )}
            {collection.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {selected === "other" && field.customInput && (
            //   <CustomInput
            //     field={{
            //       ...field.customInput,
            //       prop: "custom " + field.prop,
            //       type: "input",
            //     }}
            //     errors={errors}
            //     register={register}
            //   />
            <>
              <input
                type="text"
                placeholder={field.customInput?.placeholder}
                className="border border-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                {...register(customProp, {
                  required:
                    field.customInput?.validation.required &&
                    `${field.prop} is required`,
                  minLength: field.customInput?.validation.minLength,
                })}
              />

              <div className="min-h-[20px]">
                {errors[customProp] && (
                  <span className="text-red-500 absolute">
                    {errors[customProp]?.message as string}
                  </span>
                )}
              </div>
            </>
          )}
        </>
      )}
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
