"use client";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { Kind } from "@sinclair/typebox";
import { PropsWithoutRef, Ref, forwardRef, useCallback } from "react";
import { SubmitHandler, useForm, ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "cn";
import { X } from "lucide-react";
import { Schema } from "projects";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StateModalProps {
  schema: Schema;
  state: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<object>;
}

const DynamicInput = forwardRef(DynamicInputRender);

function StateModal({
  schema,
  state,
  open,
  onOpenChange,
  onSubmit,
}: StateModalProps) {
  const form = useForm({
    resolver: typeboxResolver(schema),
    values: state,
  });

  const internalSubmit = useCallback<SubmitHandler<object>>(
    (data, e) => {
      onSubmit(data, e);
      onOpenChange(false);
    },
    [onSubmit, onOpenChange]
  );

  return (
    <Form {...form}>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open);
          form.reset(state);
        }}
      >
        <DialogContent className="flex h-[80vh] flex-col" asChild>
          <form onSubmit={form.handleSubmit(internalSubmit)}>
            <DialogHeader className="flex flex-row items-center justify-between space-y-0">
              <DialogTitle className="text-2xl">State</DialogTitle>
              <DialogClose className="p-1">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <ScrollArea className="flex-1" type="always">
              <div className="px-2">
                {Object.entries(schema.properties).map(([name, subSchema]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="px-1">
                        <FormLabel className="text-lg capitalize">
                          {name}
                        </FormLabel>
                        <FormControl>
                          <DynamicInput
                            className={cn({
                              "border-2 border-red-500": !!error,
                            })}
                            fieldType={subSchema[Kind]}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="overflow-hidden text-ellipsis whitespace-nowrap px-2">
                          {subSchema.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="reset" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

export default StateModal;

interface DynamicInputProps
  extends Omit<InputProps, keyof ControllerRenderProps>,
    PropsWithoutRef<ControllerRenderProps> {
  fieldType: string;
}

function DynamicInputRender(
  { fieldType, ...inputProps }: DynamicInputProps,
  ref: Ref<HTMLInputElement>
) {
  switch (fieldType) {
    case "String":
      return <Input ref={ref} type="text" autoComplete="off" {...inputProps} />;
    default:
      throw new Error(`Schema kind: ${fieldType} is not supported`);
  }
}
