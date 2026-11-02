import { Copy, Download, ExternalLink, Pencil, RefreshCcw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isSafeExternalUrl } from "@/lib/lead-pipeline";
import type { Lead, LeadStatus } from "./types";

type LeadsTableProps = {
  leads: Lead[];
  totalLeads: number;
  isLoading: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSyncLeads: () => void;
  onExport: () => void;
  onCopy: (value: string, label: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onEditLead: (lead: Lead) => void;
};

const display = (value?: string) => {
  const clean = value?.trim();
  if (!clean || clean.toLowerCase() === "none" || clean.toLowerCase() === "null") return "—";
  return clean;
};

export function LeadsTable({ leads, totalLeads, isLoading, searchTerm, onSearchTermChange, onSyncLeads, onExport, onCopy, statusFilter, onStatusFilterChange, onEditLead }: LeadsTableProps) {
  return (
    <section id="leads" className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Leads Table</p>
          <h2 className="mt-0.5 text-base font-bold text-card-foreground">Saved prospects <span className="font-medium text-muted-foreground">({totalLeads})</span></h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_150px_auto_auto]">
          <label className="sr-only" htmlFor="lead-search">Filter leads</label>
          <input
            id="lead-search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Filter name, phone, email..."
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger aria-label="Filter leads by pipeline status" className="h-9"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(["new", "contacted", "qualified", "won", "lost"] as LeadStatus[]).map((status) => (
                <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="steel" size="sm" onClick={onExport} disabled={totalLeads === 0} className="h-9">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button type="button" variant="steel" size="sm" onClick={onSyncLeads} disabled={isLoading} className="h-9">
            <RefreshCcw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
            Sync leads
          </Button>
        </div>
      </div>

      {isLoading && totalLeads === 0 ? (
        <div className="grid gap-3 p-4 sm:p-5" aria-label="Loading leads">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="grid min-h-64 place-items-center p-8 text-center">
          <div className="max-w-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <SearchX className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-foreground">{totalLeads ? "No matching leads" : "No leads loaded"}</h3>
            <p className="mt-1.5 text-sm font-medium leading-6 text-muted-foreground">
              {totalLeads ? "Adjust the filter to reveal saved prospects." : "Generate leads or sync the connected leads sheet to display live records here."}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <caption className="sr-only">Powerex Fire saved business leads</caption>
            <thead className="bg-muted/70 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                {['Name', 'Industry', 'Location', 'Status', 'Follow-up', 'Notes', 'Phone', 'Email', 'Website', 'Maps', 'Edit'].map((header) => (
                  <th key={header} scope="col" className="whitespace-nowrap px-2.5 py-2.5 font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-accent/45">
                  <th scope="row" className="max-w-[240px] truncate px-2.5 py-2.5 text-left font-bold text-foreground" title={display(lead.name)}>{display(lead.name)}</th>
                  <td className="whitespace-nowrap px-2.5 py-2.5 font-medium text-muted-foreground">{display(lead.industry)}</td>
                  <td className="max-w-[170px] truncate px-2.5 py-2.5 font-medium text-muted-foreground" title={display(lead.location || lead.address)}>{display(lead.location || lead.address)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2.5"><LeadStatusBadge status={lead.status ?? "new"} /></td>
                  <td className="whitespace-nowrap px-2.5 py-2.5 font-medium text-muted-foreground">{lead.followUpDate ? new Date(`${lead.followUpDate}T00:00:00`).toLocaleDateString() : "—"}</td>
                  <td className="max-w-[170px] truncate px-2.5 py-2.5 text-xs text-muted-foreground" title={lead.notes || undefined}>{display(lead.notes)}</td>
                  <td className="whitespace-nowrap px-2.5 py-2.5">
                    <Copyable value={display(lead.phone)} label="phone" onCopy={onCopy} />
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2.5">
                    <Copyable value={display(lead.email)} label="email" onCopy={onCopy} />
                  </td>
                  <td className="px-2.5 py-2.5">
                    {display(lead.website) !== "—" && isSafeExternalUrl(lead.website) ? (
                      <a className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={lead.website} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5">
                    {isSafeExternalUrl(lead.mapsLink) ? (
                      <Button asChild variant="table" size="sm" className="h-7 px-2">
                        <a href={lead.mapsLink} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          Maps
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-2.5 py-2.5">
                    <Button type="button" variant="table" size="iconSm" aria-label={`Edit follow-up for ${lead.name}`} onClick={() => onEditLead(lead)}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const variant = status === "won" ? "default" : status === "lost" ? "destructive" : status === "qualified" ? "secondary" : "outline";
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${
    variant === "default" ? "border-transparent bg-success text-success-foreground" :
      variant === "destructive" ? "border-transparent bg-destructive text-destructive-foreground" :
        variant === "secondary" ? "border-transparent bg-accent text-accent-foreground" : "border-border bg-muted text-muted-foreground"
  }`}>{status}</span>;
}

function Copyable({ value, label, onCopy }: { value?: string; label: string; onCopy: (value: string, label: string) => void }) {
  if (!value || value === "—") return <span className="text-muted-foreground">—</span>;

  return (
    <div className="flex items-center gap-1.5">
      <span className="max-w-[220px] truncate font-medium text-foreground" title={value}>{value}</span>
      <Button type="button" variant="table" size="iconSm" aria-label={`Copy ${label}`} onClick={() => onCopy(value, label)}>
        <Copy className="h-3 w-3" aria-hidden="true" />
      </Button>
    </div>
  );
}
