import { useCallback, useEffect, useState } from "react";
import { SelectType } from "../types";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Spinner from "./Spinner";

type SelectProps = {
  field: SelectType;
  disabled: boolean;
  register: UseFormRegister<any>;

  errors: FieldErrors;
  value: string;
  setFail: (val: boolean) => void;
};

export default function Select({
  field,
  disabled,
  register,
  errors,
  value,
  setFail,
}: SelectProps) {
  const [collection, setCollection] = useState<{ id: number; name: string }[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const fetchData = useCallback(async () => {
    const response = await fetch(`http://localhost:9000/${field.collection}`);
    const data = await response.json();
    return data;
  }, [field.collection]);

  useEffect(() => {
    try {
      setIsLoading(true);

      fetchData().then((data) => {
        setCollection(data);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setFail(true);
    }
  }, [fetchData, setFail]);

  return (
    <div key={field.label} className="flex flex-col  relative">
      <label className="text-black font-medium">{field.label}</label>
      {isLoading && (
        <div className="border border-black px-4 py-1 rounded-lg">
          <Spinner />
        </div>
      )}
      <>
        <select
          value={value}
          hidden={isLoading}
          disabled={disabled}
          className="border border-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register(field.prop, {
            required: field.validation.required && `${field.prop} is required`,
          })}
        >
          <option value="">{field.placeholder}</option>
          {collection.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </>

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
