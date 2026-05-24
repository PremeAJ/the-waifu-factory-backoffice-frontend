"use client";
import { getFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { IconClipboardList } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

type AuditAction = "create" | "update" | "delete" | "approve" | "reject" | "ban" | "unban" | "";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: Record<string, unknown> | null;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
    profilePictureUrl: string | null;
  } | null;
}

const ACTION_COLORS: Record<string, "success" | "error" | "primary" | "warning" | "default"> = {
  approve: "success",
  unban: "success",
  create: "primary",
  update: "warning",
  delete: "error",
  reject: "error",
  ban: "error",
};

const ACTIONS: AuditAction[] = ["create", "update", "delete", "approve", "reject", "ban", "unban"];

export default function AuditLogPage() {
  const [action, setAction] = useState<AuditAction>("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [actorId, setActorId] = useState("");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [rows, setRows] = useState<AuditLog[]>([]);

  const params: Record<string, string | number> = { limit: 20 };
  if (action) params.action = action;
  if (entityType) params.entityType = entityType;
  if (entityId) params.entityId = entityId;
  if (actorId) params.actorId = actorId;
  if (cursor) params.cursor = cursor;

  const { data, isLoading, error } = useSWR(
    ["/api/admin/audit-log", params],
    getFetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (!data?.data) return;
    if (!cursor) {
      setRows(data.data);
    } else {
      setRows((prev) => [...prev, ...data.data]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleFilterChange = () => {
    setCursor(undefined);
    setRows([]);
  };

  const nextCursor: string | null = data?.nextCursor ?? null;

  return (
    <PageContainer title="Audit Log" description="System audit trail">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Audit Log</Typography>
      </Stack>

      {/* Filters */}
      <Stack direction="row" gap={2} mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Action</InputLabel>
          <Select
            label="Action"
            value={action}
            onChange={(e) => { setAction(e.target.value as AuditAction); handleFilterChange(); }}
          >
            <MenuItem value="">All</MenuItem>
            {ACTIONS.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Entity Type"
          placeholder="adoptable, user, tag…"
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); handleFilterChange(); }}
          sx={{ width: 180 }}
        />

        <TextField
          size="small"
          label="Entity ID"
          value={entityId}
          onChange={(e) => { setEntityId(e.target.value); handleFilterChange(); }}
          sx={{ width: 200 }}
        />

        <TextField
          size="small"
          label="Actor ID"
          value={actorId}
          onChange={(e) => { setActorId(e.target.value); handleFilterChange(); }}
          sx={{ width: 200 }}
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Entity Type</TableCell>
              <TableCell>Entity ID</TableCell>
              <TableCell>Actor</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && rows.length === 0
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : error
              ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="error">Failed to load data</Typography>
                  </TableCell>
                </TableRow>
              )
              : rows.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
                      <Box sx={{ opacity: 0.3 }}><IconClipboardList size={48} stroke={1.2} /></Box>
                      <Typography variant="body2" mt={1}>No audit logs found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
              : rows.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Chip
                      label={log.action}
                      color={ACTION_COLORS[log.action] ?? "default"}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {log.entityType.replace(/_/g, " ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                      {log.entityId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {log.actor ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src={log.actor.profilePictureUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: 12 }}>
                          {log.actor.displayName[0]}
                        </Avatar>
                        <Typography variant="body2">{log.actor.displayName}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.detail ? (
                      <Typography variant="caption" sx={{ fontFamily: "monospace", maxWidth: 200, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {JSON.stringify(log.detail)}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {new Date(log.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {nextCursor && (
        <Box mt={2} textAlign="center">
          <Button
            variant="outlined"
            disabled={isLoading}
            onClick={() => setCursor(nextCursor)}
          >
            {isLoading ? "Loading…" : "Load more"}
          </Button>
        </Box>
      )}
    </PageContainer>
  );
}
