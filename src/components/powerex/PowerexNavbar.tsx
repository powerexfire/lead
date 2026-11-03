import { Link } from "react-router-dom";
import { Crown, Gauge, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePowerexWorkspace } from "./WorkspaceContext";
import type { AppRole } from "./types";

export function PowerexNavbar({ userEmail, onSignOut }: { userEmail?: string; onSignOut: () => void }) {
  const { currentRole } = usePowerexWorkspace();
  const role: AppRole = currentRole;

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <SidebarTrigger
            className="rounded-lg border border-border bg-card p-1.5 text-foreground shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </SidebarTrigger>
          <Link to="/leads" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Powerex Fire leads home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-fire">
              <Crown className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">Powerex Fire</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Lead Command</p>
            </div>
          </Link>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            {role === "admin" ? <Crown className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" /> : <Gauge className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />}
            <span className="hidden max-w-44 truncate sm:inline">{userEmail || "Live Ops"}</span>
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">{role}</span>
          </div>
          <Button type="button" variant="table" size="sm" onClick={onSignOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
