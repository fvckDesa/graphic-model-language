"use client";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";
import { NewWorkspaceSchema, NewWorkspace, Projects } from "@/utils/workspace";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const form = useForm<NewWorkspace>({
    resolver: typeboxResolver(NewWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = useCallback<SubmitHandler<NewWorkspace>>(
    async (data) => {
      const res = await fetch("/api/workspaces/new", {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      });
      const { id } = (await res.json()) as { id: string };

      router.push(`/workspaces/${id}`);
    },
    [router]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-xl px-4 py-6"
      >
        <header>
          <h1 className="text-3xl font-bold">Create new Workspace</h1>
          <p className="text-primary/70">
            A workspace lets you work on one type of project with whoever you
            want
          </p>
        </header>
        <Separator className="my-4" />
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    spellCheck={false}
                    className={cn({
                      "border-destructive border-2": !!error,
                    })}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Workspace name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={cn({
                        "border-destructive border-2": !!error,
                      })}
                    >
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(Projects).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Workspace project type</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-4" />
        <footer className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Create</span>
          </Button>
        </footer>
      </form>
    </Form>
  );
}
