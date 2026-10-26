"use client";

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Plus } from "lucide-react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  initialProjects,
  projectStatuses,
  type DemoProject,
  type ProjectValues,
} from "@/lib/demo-projects";
import { PageHeader } from "@/app/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectEditor } from "./project-editor";

const columns: ColumnDef<DemoProject>[] = [
  { accessorKey: "name", header: "Project" },
  { accessorKey: "owner", header: "Owner" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Active" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
];
const statuses = ["All", ...projectStatuses] as const;
const pageSize = 5;

export function ProjectsCollection() {
  const [projects, setProjects] = useState(initialProjects);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault(""),
    status: parseAsStringLiteral(statuses).withDefault("All"),
    page: parseAsInteger.withDefault(1),
  });
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [editing, setEditing] = useState<DemoProject | null>(null);
  const filtered = projects.filter(
    (project) =>
      (filters.status === "All" || project.status === filters.status) &&
      `${project.name} ${project.owner}`
        .toLowerCase()
        .includes(filters.q.trim().toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.max(1, Math.min(filters.page, pageCount));
  // TanStack Table exposes mutable instance methods by design.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    // URL filters reset pagination explicitly; disable TanStack's internal reset.
    autoResetPageIndex: false,
    data: filtered,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, pagination: { pageIndex: page - 1, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function saveProject(values: ProjectValues) {
    setProjects((current) =>
      editing
        ? current.map((project) =>
            project.id === editing.id ? { ...values, id: project.id } : project,
          )
        : [{ ...values, id: crypto.randomUUID() }, ...current],
    );
    void setFilters({ q: "", status: "All", page: 1 });
    setOpen(false);
    toast.success(editing ? "Project updated" : "Project created");
  }

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <PageHeader
          title="Projects"
          description="Demo data · changes reset when you leave this page."
          actions={
            <DialogTrigger asChild>
              <Button
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setEditing(null);
                }}
              >
                <Plus className="size-4" aria-hidden="true" />
                New project
              </Button>
            </DialogTrigger>
          }
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full space-y-2 sm:max-w-sm">
            <Label htmlFor="projects-search">Search projects</Label>
            <Input
              id="projects-search"
              type="search"
              value={filters.q}
              onChange={(event) =>
                void setFilters({ q: event.target.value, page: 1 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projects-status">Filter by status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => {
                const status =
                  statuses.find((status) => status === value) ?? "All";
                void setFilters({ status, page: 1 });
              }}
            >
              <SelectTrigger id="projects-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(filters.q || filters.status !== "All") && (
            <Button
              variant="outline"
              onClick={() => void setFilters({ q: "", status: "All", page: 1 })}
            >
              Clear filters
            </Button>
          )}
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <caption className="sr-only">Demo projects</caption>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <ArrowUpDown
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  ))}
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${row.original.name}`}
                        onClick={(event) => {
                          trigger.current = event.currentTarget;
                          setEditing(row.original);
                        }}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    No matching projects. Clear filters to try again.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-muted-foreground text-sm">
            {filtered.length} projects · Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => void setFilters({ page: page - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === pageCount}
              onClick={() => void setFilters({ page: page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
        <DialogContent
          className="max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
        >
          <ProjectEditor
            key={editing?.id ?? "new"}
            editing={Boolean(editing)}
            values={{
              name: editing?.name ?? "",
              owner: editing?.owner ?? "",
              status: editing?.status ?? "Planned",
            }}
            onSave={saveProject}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
