import React from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { Product, SortKey, SortState } from "./types";
import { articleFromId, formatPriceRub, formatRating } from "./format";

const headCellSx = {
  color: "#9CA3AF",
  fontSize: 12,
  fontWeight: 700,
  borderBottom: "1px solid #E5E7EB",
};

const rowCellSx = { borderBottom: "1px solid #E5E7EB" };

function HeaderCell(props: {
  label: string;
  sortKey?: SortKey;
  sort?: SortState;
  onChangeSort?: (next: SortState) => void;
  align?: "left" | "right";
}) {
  const { label, sortKey, sort, onChangeSort, align } = props;
  const active = sortKey && sort?.key === sortKey;

  return (
    <TableCell sx={headCellSx} align={align ?? "left"}>
      {sortKey && sort && onChangeSort ? (
        <Box
          role="button"
          onClick={() => {
            if (sort.key === sortKey) {
              onChangeSort({ key: sortKey, dir: sort.dir === "asc" ? "desc" : "asc" });
            } else {
              onChangeSort({ key: sortKey, dir: "asc" });
            }
          }}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {label}
          <Box sx={{ opacity: active ? 1 : 0.35, fontSize: 11 }}>
            {active ? (sort.dir === "asc" ? "▲" : "▼") : "▲"}
          </Box>
        </Box>
      ) : (
        label
      )}
    </TableCell>
  );
}

export function ProductsTable(props: {
  rows: Product[];
  sort: SortState;
  onChangeSort: (next: SortState) => void;
}) {
  const [checked, setChecked] = React.useState<Set<number>>(new Set());

  const allChecked = props.rows.length > 0 && checked.size === props.rows.length;
  const someChecked = checked.size > 0 && checked.size < props.rows.length;

  function toggleAll() {
    setChecked((prev) => {
      if (prev.size === props.rows.length) return new Set();
      return new Set(props.rows.map((r) => r.id));
    });
  }

  function toggleOne(id: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 980 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx} width={48}>
              <Checkbox
                checked={allChecked}
                indeterminate={someChecked}
                onChange={toggleAll}
                size="small"
              />
            </TableCell>

            <HeaderCell label="Наименование" sortKey="title" sort={props.sort} onChangeSort={props.onChangeSort} />
            <TableCell sx={headCellSx} width={180}>Вендор</TableCell>
            <TableCell sx={headCellSx} width={180}>Артикул</TableCell>
            <HeaderCell label="Оценка" sortKey="rating" sort={props.sort} onChangeSort={props.onChangeSort} />
            <HeaderCell label="Цена, ₽" sortKey="price" sort={props.sort} onChangeSort={props.onChangeSort} align="left" />
            <TableCell sx={headCellSx} width={90} />
            <TableCell sx={headCellSx} width={70} />
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((p) => {
            const isRowChecked = checked.has(p.id);

            return (
              <TableRow
                key={p.id}
                hover
                sx={{
                  "&:hover": { background: "rgba(17,24,39,0.02)" },
                }}
              >
                <TableCell sx={rowCellSx}>
                  <Checkbox
                    checked={isRowChecked}
                    onChange={() => toggleOne(p.id)}
                    size="small"
                  />
                </TableCell>

                <TableCell sx={rowCellSx}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: "#D1D5DB",
                        flex: "0 0 auto",
                      }}
                    />
                    <Box>
                      <Typography fontWeight={800} sx={{ lineHeight: 1.15 }}>
                        {p.title}
                      </Typography>
                      <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
                        {p.category ?? "—"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ ...rowCellSx, fontWeight: 800 }}>
                  {p.brand ?? "—"}
                </TableCell>

                <TableCell sx={rowCellSx}>
                  {articleFromId(p.id)}
                </TableCell>

                <TableCell
                  sx={{
                    ...rowCellSx,
                    fontWeight: 800,
                    color: p.rating < 3 ? "#EF4444" : "#111827",
                  }}
                >
                  {formatRating(p.rating)}
                </TableCell>

                <TableCell sx={{ ...rowCellSx, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" }}>
                  {formatPriceRub(p.price)}
                </TableCell>

                <TableCell sx={rowCellSx} align="right">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#2F3EEB",
                      color: "#fff",
                      width: 34,
                      height: 22,
                      borderRadius: 999,
                      "&:hover": { bgcolor: "#2432C9" },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </TableCell>

                <TableCell sx={rowCellSx} align="center">
                  <IconButton size="small" sx={{ border: "1px solid #E5E7EB", width: 26, height: 26 }}>
                    <MoreHorizIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
