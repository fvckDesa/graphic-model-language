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
import { cn } from "cn";
import { WorkspaceIdSchema, WorkspaceId } from "@/utils/workspace";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<WorkspaceId>({
    resolver: typeboxResolver(WorkspaceIdSchema),
    defaultValues: {
      id: searchParams.get("id") ?? "",
    },
  });

  const onSubmit = useCallback<SubmitHandler<WorkspaceId>>(
    async (data) => {
      const res = await fetch("/api/workspaces/connect", {
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
          <h1 className="text-3xl font-bold">Connect to Workspace</h1>
          <p className="text-muted-foreground">
            Connect to a workspace for collaborate with the owner
          </p>
        </header>
        <Separator className="my-2" />
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="id"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
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
                <FormDescription>Workspace ID</FormDescription>
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
            <span>Connect</span>
          </Button>
        </footer>
      </form>
    </Form>
  );
}
