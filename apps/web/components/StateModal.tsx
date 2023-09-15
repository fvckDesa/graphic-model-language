"use client";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { Kind } from "@sinclair/typebox";
import { PropsWithoutRef, Ref, forwardRef } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  ControllerRenderProps,
} from "react-hook-form";
import { useSchema } from "@/contexts/project";

interface StateModalProps {
  nodeType: string;
  state: any;
  onCancel: () => void;
  onSubmit: SubmitHandler<object>;
}

const DynamicInput = forwardRef(DynamicInputRender);

function StateModal({ nodeType, state, onCancel, onSubmit }: StateModalProps) {
  const schema = useSchema(nodeType);
  const { control, handleSubmit } = useForm({
    resolver: typeboxResolver(schema),
    mode: "onBlur",
    values: state,
  });

  return (
    <div className="absolute left-0 top-0 flex h-screen w-screen justify-center bg-slate-500/25 p-6">
      <form
        className="rounded p-2"
        onSubmit={handleSubmit(onSubmit)}
        onReset={onCancel}
      >
        {Object.entries(schema.properties).map(([fieldName, subSchema]) => {
          return (
            <Controller
              control={control}
              name={fieldName}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label>{fieldName}</label>
                  <DynamicInput fieldType={subSchema[Kind]} {...field} />
                  {error && <p>{error.message}</p>}
                </div>
              )}
            />
          );
        })}
        <footer className="px-6 py-4">
          <button type="reset" className="rounded px-3 py-2">
            Cancel
          </button>
          <button type="submit" className="rounded px-3 py-2">
            Change
          </button>
        </footer>
      </form>
    </div>
  );
}

export default StateModal;

interface DynamicInputProps extends PropsWithoutRef<ControllerRenderProps> {
  fieldType: string;
}

function DynamicInputRender(
  { fieldType, ...controllerProps }: DynamicInputProps,
  ref: Ref<HTMLInputElement>
) {
  switch (fieldType) {
    case "String":
      return <input ref={ref} type="text" {...controllerProps} />;
    default:
      throw new Error(`Schema kind: ${fieldType} is not supported`);
  }
}
