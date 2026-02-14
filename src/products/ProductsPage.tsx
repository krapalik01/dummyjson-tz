import React from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Pagination,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./api";
import type { Product, SortState } from "./types";
import { ProductsTable } from "./ProductsTable";
import { AddProductDialog } from "./AddProductDialog";
import { useDebounce } from "./useDebounce";
import { loadSortState, saveSortState, sortProducts } from "./sort";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export function ProductsPage() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const [q, setQ] = React.useState("");
  const dq = useDebounce(q, 350);

  const [page, setPage] = React.useState(1); // 1-based
  const [rowsPerPage] = React.useState(20);

  const [sort, setSort] = React.useState<SortState>(() => loadSortState());

  const [localAdded, setLocalAdded] = React.useState<Product[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);

  const [toastOpen, setToastOpen] = React.useState(false);

  React.useEffect(() => saveSortState(sort), [sort]);
  React.useEffect(() => setPage(1), [dq]);

  const skip = (page - 1) * rowsPerPage;

  const query = useQuery({
    queryKey: ["products", { dq, rowsPerPage, skip }],
    queryFn: () => fetchProducts({ q: dq, limit: rowsPerPage, skip }),
    keepPreviousData: true,
  });

  const apiRows = query.data?.products ?? [];
  const total = query.data?.total ?? 0;
  const totalWithLocal = total + localAdded.length;
  const totalPages = Math.max(1, Math.ceil(totalWithLocal / rowsPerPage));

const merged = React.useMemo(() => {
  const base = [...localAdded, ...apiRows];
  return sortProducts(base, sort);
}, [apiRows, localAdded, sort]);




const from = totalWithLocal === 0 ? 0 : skip + 1;
const to = Math.min(skip + rowsPerPage, totalWithLocal);


  function onLogout() {
    logout();
    nav("/login", { replace: true });
  }

  function onAdd(p: Product) {
    setLocalAdded((prev) => [p, ...prev]);
    setToastOpen(true);
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Paper
          sx={{ 
            overflow: "hidden",
            boxShadow: "0 12px 50px rgba(17,24,39,0.10)",
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #E5E7EB" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" fontWeight={900} sx={{ minWidth: 90 }}>
                Товары
              </Typography>

              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <TextField
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Найти"
                  sx={{ width: "min(620px, 100%)" }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#9CA3AF", mr: 1 }} />,
                  }}
                />
              </Box>

              <Button variant="text" onClick={onLogout} sx={{ color: "#6B7280", fontWeight: 800 }}>
                Выйти
              </Button>
            </Stack>
          </Box>

          <Box sx={{ px: 3, py: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontWeight={900}>Все позиции</Typography>

              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => query.refetch()}
                  sx={{ border: "1px solid #E5E7EB", width: 34, height: 34, borderRadius: 2 }}
                >
                  <RefreshIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                </IconButton>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddOpen(true)}
                  sx={{
                    px: 2,
                    background: "#2F3EEB",
                    "&:hover": { background: "#2432C9" },
                  }}
                >
                  Добавить
                </Button>
              </Stack>
            </Stack>
          </Box>

          {query.isFetching && <LinearProgress />}

          <Box sx={{ px: 3, pb: 2 }}>
            {query.isLoading ? (
              <Box sx={{ py: 2 }}>
                <LinearProgress />
              </Box>
            ) : query.isError ? (
              <Typography color="error" fontWeight={800} sx={{ py: 2 }}>
                {query.error instanceof Error ? query.error.message : "Ошибка загрузки"}
              </Typography>
            ) : (
              <ProductsTable rows={merged} sort={sort} onChangeSort={setSort} />
            )}
          </Box>

          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ color: "#9CA3AF" }}>
              Показано {from}-{to} из {totalWithLocal}
            </Typography>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  minWidth: 28,
                  height: 28,
                  border: "1px solid #E5E7EB",
                  color: "#6B7280",
                  fontWeight: 800,
                },
                "& .Mui-selected": {
                  background: "#2F3EEB !important",
                  color: "#fff",
                  borderColor: "#2F3EEB",
                },
              }}
            />
          </Box>
        </Paper>
      </Container>

      <AddProductDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={onAdd} />

      <Snackbar
        open={toastOpen}
        autoHideDuration={1800}
        onClose={() => setToastOpen(false)}
        message="Товар добавлен"
      />
    </Box>
  );
}
