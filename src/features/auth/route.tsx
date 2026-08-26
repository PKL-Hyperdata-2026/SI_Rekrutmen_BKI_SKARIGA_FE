import { LoginPage } from "./pages/login";
import { ResetPasswordPage } from "./pages/reset-password";

export const authRoute = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
];
