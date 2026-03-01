import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, Plus, RotateCcw, Database, Cloud, HardDrive, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/hooks/useOrganization';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SourceType = 'supabase' | 'google_drive' | 'sharepoint' | 'api';
type SourceStatus = 'active' | 'inactive' | 'syncing' | 'error';

interface AIMCDataSource {
  id: string;
  source_name: string;
  source_type: SourceType;
  status: SourceStatus;
  is_active: boolean;
  last_tested: string | null;
}

interface NewDataSourceForm {
  source_name: string;
  source_type: SourceType;
  connection_config: string; // JSON string in textarea
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SOURCE_TYPE_OPTIONS: { value: SourceType; label: string; icon: React.ElementType }[] = [
  { value: 'supabase', label: 'Supabase', icon: Database },
  { value: 'google_drive', label: 'Google Drive', icon: Cloud },
  { value: 'sharepoint', label: 'SharePoint', icon: HardDrive },
  { value: 'api', label: 'API', icon: Globe },
];

const EMPTY_FORM: NewDataSourceForm = {
  source_name: '',
  source_type: 'supabase',
  connection_config: '{}',
};

function getStatusVariant(
  status: SourceStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'syncing':
      return 'outline';
    case 'error':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: SourceStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'syncing':
      return 'Syncing';
    case 'error':
      return 'Error';
    default:
      return status;
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AIMCDataSourcesPanel: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  const [dataSources, setDataSources] = useState<AIMCDataSource[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<NewDataSourceForm>(EMPTY_FORM);
  const [savingNew, setSavingNew] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  // -------------------------------------------------------------------------
  // Fetch / list sources
  // -------------------------------------------------------------------------

  const fetchDataSources = useCallback(async () => {
    if (!currentOrganization?.id) return;

    setLoadingList(true);
    try {
      // GET endpoint returns { sources: [...] } per CL3_5_DATA_MODEL_SPEC.md §6
      const { data, error } = await supabase.functions.invoke('test-data-sources-api', {
        method: 'GET',
      });

      if (error) {
        throw error;
      }

      // test-data-sources-api returns { sources: [...] }
      const sources: AIMCDataSource[] = Array.isArray(data?.sources) ? data.sources : [];

      setDataSources(sources);
    } catch (err) {
      console.error('[AIMCDataSourcesPanel] fetchDataSources error:', err);
      toast({
        title: 'Failed to load data sources',
        description:
          err instanceof Error ? err.message : 'An unexpected error occurred while loading data sources.',
        variant: 'destructive',
      });
    } finally {
      setLoadingList(false);
    }
  }, [currentOrganization?.id, toast]);

  useEffect(() => {
    if (currentOrganization?.id) {
      fetchDataSources();
    }
  }, [currentOrganization?.id, fetchDataSources]);

  // -------------------------------------------------------------------------
  // Add new source
  // -------------------------------------------------------------------------

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.source_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Source name is required.',
        variant: 'destructive',
      });
      return;
    }

    let parsedConfig: Record<string, unknown> = {};
    try {
      parsedConfig = JSON.parse(form.connection_config || '{}');
    } catch {
      toast({
        title: 'Invalid JSON',
        description: 'Connection config must be valid JSON.',
        variant: 'destructive',
      });
      return;
    }

    if (!currentOrganization?.id) {
      toast({
        title: 'No Organisation',
        description: 'No active organisation found. Please select an organisation and try again.',
        variant: 'destructive',
      });
      return;
    }

    setSavingNew(true);
    try {
      const { data, error } = await supabase.functions.invoke('connect-data-source', {
        body: {
          organisation_id: currentOrganization.id,
          source_name: form.source_name.trim(),
          source_type: form.source_type,
          connection_config: parsedConfig,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Data source added',
        description: `"${form.source_name.trim()}" has been connected successfully.`,
      });

      setForm(EMPTY_FORM);
      setShowAddForm(false);
      await fetchDataSources();
    } catch (err) {
      console.error('[AIMCDataSourcesPanel] handleAddSource error:', err);
      toast({
        title: 'Failed to add data source',
        description:
          err instanceof Error ? err.message : 'An unexpected error occurred while adding the data source.',
        variant: 'destructive',
      });
    } finally {
      setSavingNew(false);
    }
  };

  // -------------------------------------------------------------------------
  // Sync source
  // -------------------------------------------------------------------------

  const handleSync = async (sourceId: string, sourceName: string) => {
    if (!currentOrganization?.id) return;
    if (syncingIds.has(sourceId)) return;

    setSyncingIds((prev) => new Set(prev).add(sourceId));
    try {
      const { error } = await supabase.functions.invoke('sync-data-source', {
        body: {
          source_id: sourceId,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Sync triggered',
        description: `Sync started for "${sourceName}".`,
      });

      // Refresh list to reflect updated status
      await fetchDataSources();
    } catch (err) {
      console.error('[AIMCDataSourcesPanel] handleSync error:', err);
      toast({
        title: 'Sync failed',
        description:
          err instanceof Error ? err.message : 'An unexpected error occurred while syncing the data source.',
        variant: 'destructive',
      });
    } finally {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(sourceId);
        return next;
      });
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (!user) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          You must be signed in to manage AIMC data sources.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">AIMC Data Sources</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDataSources}
              disabled={loadingList}
              aria-label="Refresh data sources list"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loadingList ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddForm((prev) => !prev)}
              aria-expanded={showAddForm}
              aria-controls="add-source-form"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              {showAddForm ? 'Cancel' : 'Add Source'}
            </Button>
          </div>
        </CardHeader>

        {/* ---------------------------------------------------------------- */}
        {/* Add New Source Form                                               */}
        {/* ---------------------------------------------------------------- */}
        {showAddForm && (
          <CardContent id="add-source-form">
            <form
              onSubmit={handleAddSource}
              className="space-y-4 rounded-lg border p-4"
              aria-label="Add new AIMC data source"
              noValidate
            >
              <h3 className="text-sm font-medium">New Data Source</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Source Name */}
                <div className="space-y-1">
                  <Label htmlFor="aimc-source-name">Source Name</Label>
                  <Input
                    id="aimc-source-name"
                    placeholder="e.g. Production Supabase"
                    value={form.source_name}
                    onChange={(e) => setForm((f) => ({ ...f, source_name: e.target.value }))}
                    required
                    aria-required="true"
                  />
                </div>

                {/* Source Type */}
                <div className="space-y-1">
                  <Label htmlFor="aimc-source-type">Source Type</Label>
                  <Select
                    value={form.source_type}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, source_type: value as SourceType }))
                    }
                  >
                    <SelectTrigger id="aimc-source-type" aria-label="Select source type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Connection Config */}
              <div className="space-y-1">
                <Label htmlFor="aimc-connection-config">Connection Config (JSON)</Label>
                <Textarea
                  id="aimc-connection-config"
                  placeholder='{"url": "https://...", "key": "..."}'
                  rows={4}
                  value={form.connection_config}
                  onChange={(e) => setForm((f) => ({ ...f, connection_config: e.target.value }))}
                  aria-describedby="aimc-connection-config-hint"
                  className="font-mono text-sm"
                />
                <p id="aimc-connection-config-hint" className="text-xs text-muted-foreground">
                  Provide connection details as a valid JSON object.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setForm(EMPTY_FORM);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingNew}>
                  {savingNew ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Connecting…
                    </>
                  ) : (
                    'Connect Source'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Data Sources Table                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <CardContent className="p-0">
          {loadingList && dataSources.length === 0 ? (
            <div
              className="flex items-center justify-center py-12 text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Loading data sources…
            </div>
          ) : dataSources.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground"
              role="status"
            >
              <Database className="mb-3 h-8 w-8 opacity-40" aria-hidden="true" />
              <p className="text-sm font-medium">No data sources configured</p>
              <p className="text-xs">
                Click <strong>Add Source</strong> above to connect your first AIMC data source.
              </p>
            </div>
          ) : (
            <Table aria-label="AIMC data sources">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Tested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.map((source) => {
                  const isSyncing = syncingIds.has(source.id);
                  const displayStatus: SourceStatus = isSyncing ? 'syncing' : source.status;

                  return (
                    <TableRow key={source.id}>
                      {/* Name */}
                      <TableCell className="font-medium">{source.source_name}</TableCell>

                      {/* Type */}
                      <TableCell className="capitalize">
                        {source.source_type.replaceAll('_', ' ')}
                      </TableCell>

                      {/* Status badge */}
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(displayStatus)}
                          aria-label={`Status: ${getStatusLabel(displayStatus)}`}
                          className={
                            displayStatus === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : displayStatus === 'syncing'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              : displayStatus === 'error'
                              ? 'bg-red-100 text-red-800 hover:bg-red-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          }
                        >
                          {getStatusLabel(displayStatus)}
                        </Badge>
                      </TableCell>

                      {/* Last tested */}
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(source.last_tested)}
                      </TableCell>

                      {/* Sync action */}
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(source.id, source.source_name)}
                          disabled={isSyncing || source.status === 'syncing'}
                          aria-label={`Sync ${source.source_name}`}
                        >
                          <RotateCcw
                            className={`mr-1 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`}
                            aria-hidden="true"
                          />
                          {isSyncing ? 'Syncing…' : 'Sync'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMCDataSourcesPanel;
