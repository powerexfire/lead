import { useEffect, useState, type FormEvent } from "react";
import { Activity, CheckCircle2, Crown, Database, Globe, Loader2, RotateCcw, Save, ShieldCheck, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppRole, AppUser, LeadActivity } from "./types";

const DEFAULT_WEBHOOK_URL = "https://redican.app.n8n.cloud/webhook/Powerex-Fire-Lead";
const webhookPattern = /^https?:\/\/[^\s]{1,500}$/i;

type SettingsPanelProps = {
  userEmail?: string;
  userId?: string;
  currentRole: AppRole;
  users: AppUser[];
  activity: LeadActivity[];
  webhookUrl: string;
  isWebhookLoading: boolean;
  onRefreshActivity: () => void;
  onRefreshUsers: () => void;
  onRoleChange: (email: string, role: AppRole) => void;
  onUpdateWebhook: (url: string) => Promise<void>;
  isLoading: boolean;
  isUserLoading: boolean;
};

export function SettingsPanel({
  userEmail,
  userId,
  currentRole,
  users,
  activity,
  webhookUrl,
  isWebhookLoading,
  onRefreshActivity,
  onRefreshUsers,
  onRoleChange,
  onUpdateWebhook,
  isLoading,
  isUserLoading,
}: SettingsPanelProps) {
  const isAdmin = currentRole === "admin";
  const [webhookDraft, setWebhookDraft] = useState(webhookUrl);

  useEffect(() => {
    setWebhookDraft(webhookUrl);
  }, [webhookUrl]);

  const trimmedWebhook = webhookDraft.trim();
  const webhookError = trimmedWebhook && !webhookPattern.test(trimmedWebhook)
    ? "Enter a full address starting with http:// or https:// (up to 500 characters)."
    : "";
  const webhookChanged = trimmedWebhook !== webhookUrl.trim() && !webhookError;

  const handleWebhookSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!webhookChanged || isWebhookLoading) return;
    void onUpdateWebhook(trimmedWebhook);
  };

  return (
    <section id="settings" className="grid min-w-0 gap-4 lg:grid-cols-[0.85fr_1.15fr] [&>*]:min-w-0">
      <div className="grid min-w-0 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Settings</p>
          <h2 className="mt-0.5 text-base font-bold text-card-foreground">Production controls</h2>
          <div className="mt-4 grid gap-2.5">
            {[
              { icon: ShieldCheck, label: "Access", value: userEmail ?? "Authenticated user" },
              { icon: Crown, label: "Role", value: isAdmin ? "Admin" : "User" },
              { icon: UserCog, label: "User management", value: isAdmin ? "Admin controls enabled" : userId ? `Current user: ${userId.slice(0, 8)}…` : "Managed by secure authentication" },
              { icon: Database, label: "Storage", value: "Google Sheets Query + Data tabs" },
              { icon: CheckCircle2, label: "Validation", value: "Client and server-side input checks" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 rounded-lg border border-border bg-background p-3">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{item.label}</p>
                  <p className="mt-0.5 break-words text-xs font-medium leading-5 text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Lead Workflow</p>
              <h2 className="mt-0.5 text-base font-bold text-card-foreground">Generate Leads webhook</h2>
            </div>
            {isAdmin && (
              <Button
                type="button"
                variant="steel"
                size="sm"
                className="h-9"
                onClick={() => setWebhookDraft(DEFAULT_WEBHOOK_URL)}
                disabled={isWebhookLoading || trimmedWebhook === DEFAULT_WEBHOOK_URL}
                aria-label="Restore the default lead workflow webhook"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restore default
              </Button>
            )}
          </div>

          <p className="mt-2 text-xs font-medium leading-5 text-muted-foreground">
            The address that receives Generate Leads requests. Save a new address here and lead generation switches to it immediately.
          </p>

          {isAdmin ? (
            <form onSubmit={handleWebhookSubmit} className="mt-3 grid gap-2" noValidate>
              <label className="grid gap-1.5 text-xs font-bold text-card-foreground">
                Webhook URL
                <input
                  value={webhookDraft}
                  onChange={(event) => setWebhookDraft(event.target.value.slice(0, 500))}
                  placeholder="https://…/webhook/…"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(webhookError)}
                  aria-describedby="webhook-help"
                  className="h-9 rounded-lg border border-input bg-background px-3 font-mono text-xs font-semibold text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
                <span id="webhook-help" className={webhookError ? "text-[11px] font-bold text-destructive" : "sr-only"}>
                  {webhookError || "Must be a full address starting with http:// or https://"}
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" variant="fire" size="sm" className="h-9 px-4" disabled={!webhookChanged || isWebhookLoading || Boolean(webhookError)}>
                  {isWebhookLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                  Save webhook
                </Button>
                {webhookUrl ? (
                  <a
                    href={webhookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground transition-colors hover:bg-muted/60"
                  >
                    <Globe className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Open current
                  </a>
                ) : null}
              </div>
            </form>
          ) : (
            <div className="mt-3 rounded-lg border border-border bg-background p-3">
              <p className="break-all font-mono text-xs font-semibold text-foreground">{webhookUrl || "Loading…"}</p>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">Only admins can change this address.</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">User Management</p>
              <h2 className="mt-0.5 text-base font-bold text-card-foreground">Admin assignment</h2>
            </div>
            <Button type="button" variant="steel" size="sm" className="h-9" onClick={onRefreshUsers} disabled={isUserLoading}>
              {isUserLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <UserCog className="h-4 w-4" aria-hidden="true" />}
              Refresh
            </Button>
          </div>

          <div className="mt-4 grid gap-2.5" aria-live="polite">
            {!isAdmin ? (
              <div className="rounded-lg border border-border bg-background p-3 text-sm font-semibold text-muted-foreground">
                Admin access is required to assign roles. Your account is active as a standard user.
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-lg border border-border bg-background p-3 text-sm font-semibold text-muted-foreground">
                No users are available yet. Ask a user to sign in once, then refresh this panel.
              </div>
            ) : (
              users.map((user) => (
                <div key={user.userId} className="grid gap-3 rounded-lg border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{user.email}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">{user.role === "admin" ? "Admin" : "User"} · {user.userId.slice(0, 8)}…</p>
                  </div>
                  <Button
                    type="button"
                    variant={user.role === "admin" ? "table" : "fire"}
                    size="sm"
                    className="h-8 px-2.5"
                    onClick={() => onRoleChange(user.email, user.role === "admin" ? "user" : "admin")}
                    disabled={isUserLoading || user.email === userEmail}
                    aria-label={`${user.role === "admin" ? "Remove admin from" : "Make admin"} ${user.email}`}
                  >
                    <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                    {user.role === "admin" ? "Make user" : "Make admin"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Audit Trail</p>
            <h2 className="mt-0.5 text-base font-bold text-card-foreground">Recent activity</h2>
          </div>
          <Button type="button" variant="steel" size="sm" className="h-9" onClick={onRefreshActivity} disabled={isLoading}>
            <Activity className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>

        <div className="mt-4 grid gap-2.5" aria-live="polite">
          {activity.length === 0 ? (
            <div className="rounded-lg border border-border bg-background p-4 text-sm font-semibold text-muted-foreground">
              No activity has been recorded yet.
            </div>
          ) : (
            activity.slice(0, 8).map((item) => (
              <div key={item.id} className="grid gap-1.5 rounded-lg border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{item.action} · {item.status}</p>
                  <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground" title={item.message || undefined}>{item.message || `${item.result_count} records`}</p>
                </div>
                <time className="text-[11px] font-semibold text-muted-foreground" dateTime={item.created_at}>
                  {new Date(item.created_at).toLocaleString()}
                </time>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
