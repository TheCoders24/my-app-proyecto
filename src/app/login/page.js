// Pagin de incio de sesion

import LoginForm from "../components/LoginForms";

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <div className="text-center mt-4">
        <a href="/register" className="text-blue-500 hover:text-blue-700">
          ¿No tienes una cuenta? Regístrate
        </a>
      </div>
    </div>
  );
}