"use client";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { PropsWithChildren, useCallback, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  StringField,
  NumberField,
  BooleanField,
  EnumField,
} from "./schema-fields";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GenericState, Schema, Property, Kind } from "api";

interface StateModalProps {
  schema: Schema<Record<string, Property>>;
  state?: GenericState;
  onSubmit: SubmitHandler<GenericState>;
}

function StateModal({
  schema,
  state,
  children,
  onSubmit,
}: PropsWithChildren<StateModalProps>) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: typeboxResolver(schema),
    values: state,
  });

  const internalSubmit = useCallback<SubmitHandler<GenericState>>(
    (data, e) => {
      onSubmit(data, e);
      setOpen(false);
    },
    [onSubmit, setOpen]
  );

  return (
    <Form {...form}>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          form.reset();
          setOpen(open);
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
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
              <div className="flex flex-col gap-4 px-2">
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
  property: Property;
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
