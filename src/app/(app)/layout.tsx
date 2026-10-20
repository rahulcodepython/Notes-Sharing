import type { Metadata } from "next";
import { Suspense } from "react";
import { AppSidebar, AppSidebarFallback } from "@/components/layout/app-sidebar";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Signed-in pages are private; keep them out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Sidebar and breadcrumb read the URL, so they stream in on dynamic routes like /c/[slug].
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarFallback />}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Suspense>
            <PageBreadcrumb />
          </Suspense>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
