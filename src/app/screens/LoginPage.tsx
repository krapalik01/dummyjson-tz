import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { z } from "zod";
import { login } from "../../auth/api";
import { useAuth } from "../../auth/AuthContext";
import type { StorageMode } from "../../auth/authStorage";

const schema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  remember: z.boolean(),
});

type FormState = z.infer<typeof schema>;

export function LoginPage() {
  const nav = useNavigate();
  const { setAuthToken, token } = useAuth();

  const [form, setForm] = React.useState<FormState>({
    username: "",
    password: "",
    remember: false,
  });

  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  React.useEffect(() => {
    if (token) nav("/products", { replace: true });
  }, [token, nav]);

  const storageMode: StorageMode = form.remember ? "local" : "session";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setFieldErrors((p) => ({ ...p, [key]: undefined }));
    setApiError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "username" || key === "password" || key === "remember") next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    setLoading(true);
    try {
      const res = await login({ username: form.username, password: form.password });
      setAuthToken(res.token, storageMode);
      nav("/products", { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: 420, maxWidth: "100%", borderRadius: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2.2} component="form" onSubmit={onSubmit}>
            <Box sx={{ display: "grid", placeItems: "center", mb: 0.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  boxShadow: "0 10px 25px rgba(17,24,39,0.10)",
                  display: "grid",
                  placeItems: "center",
                  background: "#fff",
                }}
              >
                <Box sx={{ width: 18, height: 18, borderRadius: 2, background: "#111827", opacity: 0.9 }} />
              </Box>
            </Box>

            <Typography variant="h5" fontWeight={900} textAlign="center">
              Добро пожаловать!
            </Typography>
            <Typography sx={{ color: "#9CA3AF" }} textAlign="center">
              Пожалуйста, авторизируйтесь
            </Typography>

            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>Логин</Typography>
              <TextField
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                error={Boolean(fieldErrors.username)}
                helperText={fieldErrors.username}
                placeholder="Введите логин"
                fullWidth
                InputProps={{
                  startAdornment: <PersonOutlineIcon sx={{ color: "#9CA3AF", mr: 1 }} />,
                  endAdornment: form.username ? (
                    <IconButton size="small" onClick={() => update("username", "")}>
                      <CloseIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
                    </IconButton>
                  ) : null,
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>Пароль</Typography>
              <TextField
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
                placeholder="Введите пароль"
                type={showPass ? "text" : "password"}
                fullWidth
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ color: "#9CA3AF", mr: 1 }} />,
                  endAdornment: (
                    <IconButton size="small" onClick={() => setShowPass((p) => !p)}>
                      {showPass ? (
                        <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
                      )}
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.remember}
                  onChange={(e) => update("remember", e.target.checked)}
                  size="small"
                />
              }
              label={<Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>Запомнить данные</Typography>}
            />

            {apiError && <Alert severity="error">{apiError}</Alert>}

            <Button
              type="submit"
              disabled={loading}
              size="large"
              sx={{
                height: 44,
                borderRadius: 2.5,
                color: "#fff",
                background: "linear-gradient(180deg, #3C4BFF 0%, #2230D8 100%)",
                "&:hover": { background: "linear-gradient(180deg, #3242FF 0%, #1F2CCB 100%)" },
              }}
            >
              {loading ? "Входим..." : "Войти"}
            </Button>

            <Divider sx={{ color: "#9CA3AF", fontSize: 12 }}>или</Divider>

            <Typography textAlign="center" sx={{ color: "#9CA3AF", fontSize: 12 }}>
              Нет аккаунта?{" "}
              <Link href="#" underline="hover" sx={{ fontWeight: 900 }}>
                Создать
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
