"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  demoProjectSchema,
  projectStatuses,
  type ProjectValues,
} from "@/lib/demo-projects";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProjectEditorProps = Readonly<{
  values: ProjectValues;
  editing: boolean;
  onSave: (values: ProjectValues) => void;
}>;

export function ProjectEditor({ values, editing, onSave }: ProjectEditorProps) {
  const form = useForm<ProjectValues>({
    resolver: zodResolver(demoProjectSchema),
    defaultValues: values,
  });
  const errors = form.formState.errors;
  return (
    <>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
        <DialogDescription>
          Demo changes reset when you leave this page.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "project-name-error" : undefined}
            {...form.register("name")}
          />
          {errors.name && (
            <p
              id="project-name-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-owner">Owner email</Label>
          <Input
            id="project-owner"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.owner)}
            aria-describedby={errors.owner ? "project-owner-error" : undefined}
            {...form.register("owner")}
          />
          {errors.owner && (
            <p
              id="project-owner-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.owner.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-status">Status</Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="project-status"
                  ref={field.ref}
                  onBlur={field.onBlur}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {editing ? "Save project" : "Create project"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
