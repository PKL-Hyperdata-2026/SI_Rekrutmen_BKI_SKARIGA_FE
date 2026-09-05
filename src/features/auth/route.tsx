import { LoginPage } from "./login/login-page";
import { ResetPasswordPage } from "./reset-password/reset-password-page";

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
