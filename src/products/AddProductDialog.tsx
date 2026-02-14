import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { z } from "zod";
import type { Product } from "./types";

const schema = z.object({
  title: z.string().min(1, "Введите наименование"),
  price: z.coerce.number().positive("Цена должна быть > 0"),
  brand: z.string().min(1, "Введите вендора"),
  // Артикул в API не сохраняем — но поле есть
  article: z.string().min(1, "Введите артикул"),
});

type Form = z.infer<typeof schema>;

export function AddProductDialog(props: {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Product) => void;
}) {
  const [form, setForm] = React.useState<Form>({
    title: "",
    price: 0,
    brand: "",
    article: "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof Form, string>>>({});

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function submit() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof Form, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "title" || key === "price" || key === "brand" || key === "article") {
          next[key] = issue.message;
        }
      }
      setErrors(next);
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      title: parsed.data.title,
      price: parsed.data.price,
      brand: parsed.data.brand,
      rating: 5,
      category: "—",
    };

    props.onAdd(newProduct);
    props.onClose();
    setForm({ title: "", price: 0, brand: "", article: "" });
    setErrors({});
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавление товара</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Наименование"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            error={Boolean(errors.title)}
            helperText={errors.title}
            fullWidth
          />
          <TextField
            label="Цена"
            value={String(form.price)}
            onChange={(e) => update("price", Number(e.target.value))}
            error={Boolean(errors.price)}
            helperText={errors.price}
            fullWidth
            inputMode="decimal"
          />
          <TextField
            label="Вендор"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            error={Boolean(errors.brand)}
            helperText={errors.brand}
            fullWidth
          />
          <TextField
            label="Артикул"
            value={form.article}
            onChange={(e) => update("article", e.target.value)}
            error={Boolean(errors.article)}
            helperText={errors.article}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={props.onClose}>Отмена</Button>
        <Button variant="contained" onClick={submit}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
