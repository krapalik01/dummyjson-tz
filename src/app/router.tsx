import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./App";
import { LoginPage } from "./screens/LoginPage";
import { ProductsPage } from "../products/ProductsPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/products" replace /> },
]);
