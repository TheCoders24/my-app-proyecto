"use client";

const LoginPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault(); // Evitar que el formulario se recargue
    const username = event.target.username.value;
    const password = event.target.password.value;

    console.log("Username:", username);
    console.log("Password:", password);
    // Aquí puedes agregar lógica para autenticar al usuario
    alert("Username:", username);
    alert("Password:", password);
  };

  return (
    <div className="login-page flex justify-center items-center h-screen bg-gray-100">
      <form
        className="login-form bg-white p-8 rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <label
          htmlFor="username"
          className="block text-gray-700 font-medium mb-2"
        >
          Username: 
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
