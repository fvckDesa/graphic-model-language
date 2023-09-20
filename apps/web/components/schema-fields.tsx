import { ComponentPropsWithoutRef } from "react";
import {
  StateProperty,
  StringProperty,
  NumberProperty,
  BooleanProperty,
  EnumProperty,
} from "api";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";

export interface StateField<P extends StateProperty>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  stateProperty: P;
}

export function StringField({
  name,
  stateProperty,
  ...fieldProps
}: StateField<StringProperty>) {
  return (
    <FormField
      {...fieldProps}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="px-1">
          <FormLabel className="text-lg capitalize">{name}</FormLabel>
          <FormControl>
            <Input
              type="text"
              className={cn({
                "border-2 border-red-500": !!error,
              })}
              {...field}
            />
          </FormControl>
          <FormDescription className="overflow-hidden text-ellipsis whitespace-nowrap px-2">
            {stateProperty.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NumberField({
  name,
  stateProperty,
  ...fieldProps
}: StateField<NumberProperty>) {
  return (
    <FormField
      {...fieldProps}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="px-1">
          <FormLabel className="text-lg capitalize">{name}</FormLabel>
          <FormControl>
            <Input
              type="number"
              className={cn({
                "border-2 border-red-500": !!error,
              })}
              {...field}
            />
          </FormControl>
          <FormDescription className="overflow-hidden text-ellipsis whitespace-nowrap px-2">
            {stateProperty.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function BooleanField({
  name,
  stateProperty,
  ...fieldProps
}: StateField<BooleanProperty>) {
  return (
    <FormField
      {...fieldProps}
      name="mobile"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {name}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}

export function EnumField({
  name,
  stateProperty,
  ...fieldProps
}: StateField<EnumProperty<string>>) {
  return (
    <FormField
      {...fieldProps}
      name="mobile"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${name}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {stateProperty.enum.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
