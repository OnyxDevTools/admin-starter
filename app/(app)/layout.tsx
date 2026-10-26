import project from "@/project.json";
import { AppSidebar } from "@/app/components/app-sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground min-h-screen pl-20">
      <AppSidebar />
      <header className="border-border/70 bg-background sticky top-0 z-20 flex min-h-16 items-center border-b px-4 sm:px-8">
        <span className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
          {project.name}
        </span>
      </header>
      <main className="mx-auto w-full max-w-300 min-w-0 px-4 py-8 pb-16 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
