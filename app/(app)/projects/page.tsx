import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ProjectsCollection } from "./_components/projects-collection";

export const metadata = { title: "Projects" } satisfies Metadata;

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ProjectsCollection />
    </Suspense>
  );
}
