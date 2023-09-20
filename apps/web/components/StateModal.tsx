"use client";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  StringField,
  NumberField,
  BooleanField,
  EnumField,
} from "./schema-fields";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { State, StateSchema, StateSchemaProperty, Kind } from "api";

interface StateModalProps {
  schema: StateSchema;
  state: State<StateSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<State<StateSchema>>;
}

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

  const internalSubmit = useCallback<SubmitHandler<State<StateSchema>>>(
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
                {Object.entries(schema.properties).map(([name, property]) => (
                  <StateField key={name} name={name} property={property} />
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

interface StateFieldProps {
  name: string;
  property: StateSchemaProperty;
}

function StateField({ name, property }: StateFieldProps) {
  switch (property[Kind]) {
    case "String":
      return <StringField name={name} stateProperty={property} />;
    case "Number":
      return <NumberField name={name} stateProperty={property} />;
    case "Boolean":
      return <BooleanField name={name} stateProperty={property} />;
    case "Enum":
      return <EnumField name={name} stateProperty={property} />;
    default:
      throw new Error(`Schema kind: ${property[Kind]} is not supported`);
  }
}
