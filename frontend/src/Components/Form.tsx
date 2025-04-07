import { useState, useEffect, useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Step } from "../types";
import CustomInput from "./CustomInput";
import CustomCheckbox from "./CustomCheckBox";
import CustomSelect from "./CustomSelect";
import Select from "./Select";
import Spinner from "./Spinner";
import SuccessPage from "./SuccessPage";
import ErrorPage from "./ErrorPage";

export default function Form() {
  type FormFields = {
    name: string;
    surname: string;
    city: number;
    school: number | string;
    password: string;
    termsAndConditions: boolean;
    email: string;
  };

  const [currentStep, setCurrentStep] = useState("Step 1");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
    setValue,

    watch,
  } = useForm();
  const [formSteps, setFormSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const stepCount = formSteps.length;
  const currentStepNumber = Number(currentStep.split(" ")[1]);

  const stepData = formSteps.find((f) => f.title === currentStep);

  const nextStep = () => {
    if (currentStepNumber < stepCount) {
      setCurrentStep(`Step ${currentStepNumber + 1}`);
    }
  };

  const prevStep = () => {
    if (currentStepNumber > 1 && currentStepNumber <= stepCount) {
      setCurrentStep(`Step ${currentStepNumber - 1}`);
    }
  };

  const selectedCityId = watch("city");
  const selectedSchool = watch("school");

  const searchStep = useCallback(
    (key: string) => {
      for (let obj of formSteps) {
        if (obj.fields.find((f) => f.prop === key)) {
          return obj.title;
        }
      }
      return null;
    },
    [formSteps]
  );

  const getFormData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:9000/form");
      const data = await response.json();
      setFormSteps(data);
      setFail(false);
    } catch (error) {
      console.error(error);
      setFail(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch form data only once on mount
  useEffect(() => {
    getFormData();
  }, []);

  // Handle errors separately
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const errorStep = searchStep(firstError);
      if (errorStep) {
        setCurrentStep(errorStep);
        setFocus(firstError);
      }
    }
  }, [errors, searchStep, setFocus]);

  const prepData = (data: FieldValues) => {
    const resultData:
      | FormFields
      | Record<string, number | string | boolean | null> = {
      name: "",
      surname: "",
      city: 0,
      school: 0,
      password: "",
      termsAndConditions: false,
      mail: "",
    };
    for (let key of Object.keys(data)) {
      if (key.startsWith("custom")) {
        continue;
      } else {
        resultData[key as keyof FormFields] = data[key];
      }
    }
    if (resultData["city"]) {
      resultData["city"] = Number(resultData["city"]);
    }
    if (resultData["age"]) {
      resultData["age"] = Number(resultData["age"]);
    } else {
      resultData["age"] = null;
    }
    if (resultData["school"] === "other") {
      resultData["school"] = data["customSchool"];
    } else {
      resultData["school"] = Number(resultData["school"]);
    }

    return resultData;
  };

  const onConfirm = async (data: FieldValues) => {
    const sendData = prepData(data);

    await fetch("http://localhost:9000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (Object.keys(data).length > 0) {
          for (const key of Object.keys(data)) {
            console.log(data[key]);

            setError(key, {
              type: "manual",
              message: data[key]._errors.join("\n"),
            });
            setValue(key, "");
          }

          await getFormData();
        } else {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setFail(true);
      });
  };

  if (fail) {
    return <ErrorPage onRetry={getFormData} />;
  }

  if (success) {
    return <SuccessPage />;
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            if (Object.keys(errors).length > 0) return;
            if (currentStepNumber < stepCount) {
              console.log(currentStepNumber, stepCount);
              nextStep();
              return;
            }

            onConfirm(data);
          })}
          className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 flex flex-col gap-3"
        >
          {stepData?.fields.map((field) =>
            field.type === "input" ? (
              <CustomInput
                key={field.label}
                field={field}
                register={register}
                errors={errors}
              />
            ) : field.type === "checkbox" ? (
              <CustomCheckbox
                key={field.label}
                field={field}
                register={register}
                errors={errors}
              />
            ) : field.type === "select" && field.allowCustomInput ? (
              <CustomSelect
                key={field.label}
                field={field}
                register={register}
                errors={errors}
                selected={selectedSchool}
                selectedDependency={selectedCityId}
                disabled={field.prop === "school" && !selectedCityId}
                setFail={setFail}
              />
            ) : field.type === "select" && !field.allowCustomInput ? (
              <Select
                value={field.prop === "city" ? selectedCityId : ""}
                key={field.label}
                field={field}
                register={register}
                errors={errors}
                disabled={field.prop === "school" && !selectedCityId}
                setFail={setFail}
              />
            ) : null
          )}

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            {currentStepNumber < stepCount ? "Next Step" : "Submit"}
          </button>
          {currentStepNumber > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Prev Step
            </button>
          )}
        </form>
      )}
    </>
  );
}
