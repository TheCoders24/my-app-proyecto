// Pagina de Registro

import RegisterForm from "../components/RegisterForms";

export default function RegisterPage() {
  return (
    <div>
      <RegisterForm />
      <div className="text-center mt-4">
        <a href="/login" className="text-blue-500 hover:text-blue-700">
          ¿Ya tienes una cuenta? Inicia Sesión
        </a>
      </div>
    </div>
  );
}