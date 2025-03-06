# API de Autenticación de Usuarios

Este endpoint permite a los usuarios autenticarse proporcionando su correo electrónico y contraseña. Utiliza JSON Web Tokens (JWT) para la autenticación y gestiona intentos fallidos para prevenir ataques de fuerza bruta.

## Endpoints

* `POST /api/auth/login`: Autentica a un usuario y devuelve un token JWT.

## Requisitos Previos

* Base de datos PostgreSQL configurada con una tabla `Usuarios` que contiene los campos `id`, `email`, `password` y `rol`.
* Variables de entorno:
    * `JWT_SECRET`: Clave secreta para firmar los tokens JWT.

## Dependencias

* `bcrypt`: Para el hash de contraseñas.
* `jsonwebtoken`: Para generar y verificar tokens JWT.
* `validator`: Para la validación de datos de entrada.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Manejo de Errores

* **400 Bad Request:**
    * Campos de correo electrónico o contraseña faltantes.
    * Formato de correo electrónico inválido.
    * Contraseña no cumple con los requisitos de seguridad.
* **401 Unauthorized:**
    * Credenciales incorrectas (correo electrónico o contraseña).
* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **429 Too Many Requests:**
    * Demasiados intentos fallidos desde la misma dirección IP.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Autenticación

1.  El cliente envía una solicitud `POST` al endpoint `/api/auth/login` con el correo electrónico y la contraseña en el cuerpo de la solicitud (formato JSON).
2.  El servidor valida los datos de entrada y verifica si el usuario existe en la base de datos.
3.  Si el usuario existe, el servidor compara la contraseña proporcionada con el hash almacenado en la base de datos.
4.  Si la contraseña es válida, el servidor genera un token JWT y lo envía como una cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
5.  El cliente puede utilizar el token JWT para acceder a recursos protegidos en futuras solicitudes.

## Protección contra Fuerza Bruta

* El servidor rastrea los intentos fallidos de inicio de sesión por dirección IP.
* Después de 5 intentos fallidos, la IP se bloquea durante 15 minutos.
* Los intentos exitosos de inicio de sesión reinician el contador de intentos fallidos.

## Detalles del Código

### Validación de Entrada

* Se utiliza `validator.isEmail()` para validar el formato del correo electrónico.
* Opcionalmente, se utiliza `validator.isStrongPassword()` para validar la fortaleza de la contraseña.

### Manejo de Intentos Fallidos

* Se utiliza un objeto `failedAttempts` para almacenar el número de intentos fallidos y la marca de tiempo del último intento por dirección IP.
* Si el número de intentos fallidos supera un umbral, la dirección IP se bloquea durante un período de tiempo especificado.

### Generación de Token JWT

* Se utiliza `jwt.sign()` para generar el token JWT.
* El payload del token contiene el ID de usuario, el correo electrónico y el rol.
* El token tiene una duración de 1 hora.

### Configuración de Cookies

* El token JWT se envía como una cookie `HttpOnly`, `Secure` y `SameSite=Strict` para mayor seguridad.
* La cookie tiene una duración de 1 hora.

### Manejo de Errores

* Se utilizan bloques `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.

## Ejemplo de Solicitud

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "[dirección de correo electrónico eliminada]",
  "password": "contraseñaSegura"
}


HTTP/1.1 200 OK
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600

{
  "message": "Autenticación exitosa",
  "rol": "usuario"
}


# API de Registro de Usuarios

Este endpoint permite registrar nuevos usuarios en la base de datos. Realiza validaciones de entrada, verifica la existencia del correo electrónico y almacena la contraseña de forma segura mediante hashing.

## Endpoints

* `POST /api/auth/register`: Registra un nuevo usuario.

## Requisitos Previos

* Base de datos PostgreSQL configurada con una tabla `Usuarios` que contiene los campos `id`, `nombre`, `email`, `password` y `rol`.
* Variables de entorno:
    * `JWT_SECRET`: Clave secreta para firmar los tokens JWT (opcional).

## Dependencias

* `bcrypt`: Para el hash de contraseñas.
* `jsonwebtoken`: Para generar y verificar tokens JWT (opcional).
* `validator`: Para la validación de datos de entrada.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Manejo de Errores

* **400 Bad Request:**
    * Campos de nombre, correo electrónico, contraseña o rol faltantes.
    * Formato de correo electrónico inválido.
    * Contraseña no cumple con los requisitos de seguridad.
    * El correo electrónico ya está registrado.
* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Registro de Usuario

1.  El cliente envía una solicitud `POST` al endpoint `/api/auth/register` con el nombre, correo electrónico, contraseña y rol del nuevo usuario en el cuerpo de la solicitud (formato JSON).
2.  El servidor valida los datos de entrada y verifica si el correo electrónico ya está registrado en la base de datos.
3.  Si el correo electrónico no está registrado, el servidor realiza el hash de la contraseña utilizando `bcrypt`.
4.  El servidor inserta el nuevo usuario en la base de datos con la contraseña hasheada.
5.  Opcionalmente, el servidor genera un token JWT y lo envía como una cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
6.  El servidor envía una respuesta exitosa con el código de estado 201.

## Detalles del Código

### Validación de Entrada

* Se utiliza `validator.isEmail()` para validar el formato del correo electrónico.
* Se utiliza `validator.isStrongPassword()` para validar la fortaleza de la contraseña.

### Hash de Contraseña

* Se utiliza `bcrypt.hash()` para generar el hash de la contraseña.
* El costo del hashing se establece en 10.

### Generación de Token JWT (Opcional)

* Se utiliza `jwt.sign()` para generar el token JWT.
* El payload del token contiene el ID de usuario, el correo electrónico y el rol.
* El token tiene una duración de 1 hora.

### Configuración de Cookies (Opcional)

* El token JWT se envía como una cookie `HttpOnly`, `Secure` y `SameSite=Strict` para mayor seguridad.
* La cookie tiene una duración de 1 hora.

### Manejo de Errores

* Se utilizan bloques `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.

## Ejemplo de Solicitud

```json
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Nombre de Ejemplo",
  "email": "[dirección de correo electrónico eliminada]",
  "password": "contraseñaSegura",
  "rol": "usuario"
}


HTTP/1.1 201 Created
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600 (opcional)

{
  "message": "Usuario registrado exitosamente"
}


# API de Creación de Categorías

Este endpoint permite crear nuevas categorías en la base de datos.

## Endpoints

* `POST /api/categorias`: Crea una nueva categoría.

## Requisitos Previos

* Base de datos PostgreSQL configurada con una tabla `Categorias` que contiene el campo `nombre`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Creación de Categoría

1.  El cliente envía una solicitud `POST` al endpoint `/api/categorias` con el nombre de la nueva categoría en el cuerpo de la solicitud (formato JSON).
2.  El servidor inserta el nuevo nombre de la categoría en la base de datos.
3.  El servidor devuelve la categoría recién creada con un código de estado 201.

## Detalles del Código

### Validación de Entrada

* El código verifica que el método de la solicitud sea `POST`.
* No se realizan validaciones de formato específicas para el nombre de la categoría en este ejemplo, pero se recomienda agregar validaciones adicionales según los requisitos.

### Inserción en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar una consulta SQL `INSERT` en la tabla `Categorias`.
* La consulta devuelve la categoría recién creada (`RETURNING *`).

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.

## Ejemplo de Solicitud

```json
POST /api/categorias
Content-Type: application/json

{
  "nombre": "Nueva Categoría"
}

HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "nombre": "Nueva Categoría"
}


# API de Movimientos Recientes

Este endpoint permite obtener los 10 movimientos más recientes registrados en la base de datos, incluyendo información detallada del producto, el tipo de movimiento, la cantidad, la fecha y el usuario que realizó el movimiento.

## Endpoints

* `GET /api/movimientos/recientes`: Obtiene los 10 movimientos más recientes.

## Requisitos Previos

* Base de datos PostgreSQL configurada con las tablas `Movimientos`, `Productos` y `Usuarios`.
* Las tablas deben tener las siguientes relaciones:
    * `Movimientos.producto_id` referencia a `Productos.id`
    * `Movimientos.usuario_id` referencia a `Usuarios.id` (opcional)
* `../../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Obtener Movimientos Recientes

1.  El cliente realiza una solicitud `GET` al endpoint `/api/movimientos/recientes`.
2.  El servidor ejecuta una consulta SQL para obtener los 10 movimientos más recientes, ordenados por fecha de forma descendente.
3.  La consulta incluye información del producto, el tipo de movimiento, la cantidad, la fecha y el usuario (si está disponible).
4.  El servidor devuelve un array JSON con los resultados de la consulta.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT` con `INNER JOIN` para obtener información de las tablas `Movimientos` y `Productos`.
* Se utiliza `LEFT JOIN` para obtener información de la tabla `Usuarios` (si está disponible).
* Los resultados se ordenan por fecha de forma descendente (`ORDER BY Movimientos.fecha DESC`).
* Se utiliza `LIMIT 10` para obtener solo los 10 movimientos más recientes.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "producto": "Producto A",
    "tipo": "entrada",
    "cantidad": 10,
    "fecha": "2023-10-27T12:00:00.000Z",
    "usuario": "Usuario X"
  },
  {
    "id": 2,
    "producto": "Producto B",
    "tipo": "salida",
    "cantidad": 5,
    "fecha": "2023-10-26T15:30:00.000Z",
    "usuario": null
  },
  // ... otros movimientos
]


# API de Registro de Movimientos

Este endpoint permite registrar nuevos movimientos en la base de datos, asociando un producto, un tipo de movimiento (entrada o salida), una cantidad y, opcionalmente, un usuario.

## Endpoints

* `POST /api/movimientos`: Registra un nuevo movimiento.

## Requisitos Previos

* Base de datos PostgreSQL configurada con una tabla `Movimientos` que contiene los campos `producto_id`, `tipo`, `cantidad` y `usuario_id` (opcional).
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **400 Bad Request:**
    * Faltan campos requeridos: `producto_id`, `tipo`, `cantidad`.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Registro de Movimiento

1.  El cliente envía una solicitud `POST` al endpoint `/api/movimientos` con los datos del movimiento en el cuerpo de la solicitud (formato JSON).
2.  El servidor valida que los campos requeridos estén presentes.
3.  El servidor inserta el nuevo movimiento en la base de datos.
4.  El servidor devuelve el movimiento registrado con un código de estado 201.

## Detalles del Código

### Validación de Entrada

* El código verifica que los campos `producto_id`, `tipo` y `cantidad` estén presentes en el cuerpo de la solicitud.
* Si alguno de los campos requeridos falta, se devuelve un error 400.

### Inserción en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar una consulta SQL `INSERT` en la tabla `Movimientos`.
* La consulta devuelve el movimiento recién creado (`RETURNING *`).

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, incluyendo el mensaje de error para ayudar en la depuración.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500.

## Ejemplo de Solicitud

```json
POST /api/movimientos
Content-Type: application/json

{
  "producto_id": 1,
  "tipo": "entrada",
  "cantidad": 10,
  "usuario_id": 1
}

HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Movimiento registrado exitosamente",
  "data": {
    "id": 1,
    "producto_id": 1,
    "tipo": "entrada",
    "cantidad": 10,
    "usuario_id": 1,
    "fecha": "2023-10-27T12:00:00.000Z"
  }
}

# API de Movimientos Recientes

Este endpoint permite obtener los 10 movimientos más recientes registrados en la base de datos, incluyendo información detallada del producto, el tipo de movimiento, la cantidad y la fecha.

## Endpoints

* `GET /api/movimientos/recientes`: Obtiene los 10 movimientos más recientes.

## Requisitos Previos

* Base de datos PostgreSQL configurada con las tablas `Movimientos` y `Productos`.
* Las tablas deben tener la siguiente relación:
    * `Movimientos.producto_id` referencia a `Productos.id`
* `../../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Obtener Movimientos Recientes

1.  El cliente realiza una solicitud `GET` al endpoint `/api/movimientos/recientes`.
2.  El servidor ejecuta una consulta SQL para obtener los 10 movimientos más recientes, ordenados por fecha de forma descendente.
3.  La consulta incluye información del producto, el tipo de movimiento, la cantidad y la fecha.
4.  El servidor devuelve un array JSON con los resultados de la consulta.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT` con `INNER JOIN` para obtener información de las tablas `Movimientos` y `Productos`.
* Los resultados se ordenan por fecha de forma descendente (`ORDER BY Movimientos.fecha DESC`).
* Se utiliza `LIMIT 10` para obtener solo los 10 movimientos más recientes.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "producto": "Producto A",
    "tipo": "entrada",
    "cantidad": 10,
    "fecha": "2023-10-27T12:00:00.000Z"
  },
  {
    "id": 2,
    "producto": "Producto B",
    "tipo": "salida",
    "cantidad": 5,
    "fecha": "2023-10-26T15:30:00.000Z"
  },
  // ... otros movimientos
]

# API de Gestión de Productos

Este endpoint permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre la tabla `Productos` en la base de datos.

## Endpoints

* `POST /api/productos`: Crea un nuevo producto.
* `GET /api/productos`: Obtiene todos los productos.
* `GET /api/productos?id={id}`: Obtiene un producto específico por ID.
* `PUT /api/productos?id={id}`: Actualiza un producto existente.
* `DELETE /api/productos?id={id}`: Elimina un producto.

## Requisitos Previos

* Base de datos PostgreSQL configurada con una tabla `Productos` que contiene los campos `id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria_id` (opcional) y `proveedor_id` (opcional).
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **400 Bad Request:**
    * Campos requeridos faltantes (nombre, precio, stock).
    * Valores no numéricos para precio, stock, categoria_id o proveedor_id.
    * ID de producto no válido (para PUT y DELETE).
* **404 Not Found:**
    * Producto no encontrado (para GET por ID, PUT y DELETE).
* **405 Method Not Allowed:**
    * Se utiliza un método HTTP no soportado.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Crear Producto (POST)

1.  El cliente envía una solicitud `POST` al endpoint `/api/productos` con los datos del nuevo producto en el cuerpo de la solicitud (formato JSON).
2.  El servidor valida que los campos requeridos estén presentes y sean válidos.
3.  El servidor inserta el nuevo producto en la base de datos.
4.  El servidor devuelve el producto creado con un código de estado 201.

## Obtener Productos (GET)

* **Obtener todos los productos:**
    1.  El cliente realiza una solicitud `GET` al endpoint `/api/productos`.
    2.  El servidor ejecuta una consulta SQL para obtener todos los productos (id, nombre, stock, precio).
    3.  El servidor devuelve un array JSON con los resultados de la consulta.
* **Obtener un producto por ID:**
    1.  El cliente realiza una solicitud `GET` al endpoint `/api/productos?id={id}`.
    2.  El servidor ejecuta una consulta SQL para obtener el producto con el ID especificado.
    3.  Si el producto existe, el servidor lo devuelve en formato JSON. Si no existe, devuelve un error 404.

## Actualizar Producto (PUT)

1.  El cliente envía una solicitud `PUT` al endpoint `/api/productos?id={id}` con los datos actualizados del producto en el cuerpo de la solicitud (formato JSON).
2.  El servidor valida que el ID del producto sea válido y que los campos requeridos estén presentes y sean válidos.
3.  El servidor actualiza el producto en la base de datos.
4.  Si el producto existe, el servidor devuelve el producto actualizado con un código de estado 200. Si no existe, devuelve un error 404.

## Eliminar Producto (DELETE)

1.  El cliente envía una solicitud `DELETE` al endpoint `/api/productos?id={id}`.
2.  El servidor valida que el ID del producto sea válido.
3.  El servidor elimina el producto de la base de datos.
4.  Si el producto existe, el servidor devuelve un mensaje de éxito y el producto eliminado con un código de estado 200. Si no existe, devuelve un error 404.

## Detalles del Código

### Validación de Entrada

* Se verifica que los campos requeridos estén presentes y que los valores numéricos sean válidos.

### Inserción/Actualización/Eliminación en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar consultas SQL.

### Manejo de Errores

* Se utilizan bloques `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, incluyendo el mensaje de error para ayudar en la depuración.
* Se devuelven mensajes de error JSON con los códigos de estado apropiados.

## Ejemplos de Solicitud

### Crear Producto (POST)

```json
POST /api/productos
Content-Type: application/json

{
  "nombre": "Producto Ejemplo",
  "descripcion": "Descripción del producto",
  "precio": 19.99,
  "stock": 100,
  "categoria_id": 1,
  "proveedor_id": 2
}

PUT /api/productos?id=1
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "precio": 24.99,
  "stock": 50
}

# API de Registro de Proveedores

Este endpoint permite registrar nuevos proveedores en la base de datos.

## Endpoints

* `POST /api/proveedores`: Registra un nuevo proveedor.

## Requisitos Previos

* Base de datos PostgreSQL configurada con una tabla `Proveedores` que contiene los campos `nombre`, `contacto`, `telefono` y `email`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Registro de Proveedor

1.  El cliente envía una solicitud `POST` al endpoint `/api/proveedores` con los datos del nuevo proveedor en el cuerpo de la solicitud (formato JSON).
2.  El servidor inserta el nuevo proveedor en la base de datos.
3.  El servidor devuelve el proveedor recién creado con un código de estado 201.

## Detalles del Código

### Validación de Entrada

* El código verifica que el método de la solicitud sea `POST`.
* No se realizan validaciones de formato específicas para los campos, pero se recomienda agregar validaciones adicionales según los requisitos.
* Los campos `contacto`, `telefono` y `email` son opcionales y se insertan como `null` si no se proporcionan.

### Inserción en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar una consulta SQL `INSERT` en la tabla `Proveedores`.
* La consulta devuelve el proveedor recién creado (`RETURNING *`).

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.

## Ejemplo de Solicitud

```json
POST /api/proveedores
Content-Type: application/json

{
  "nombre": "Proveedor Ejemplo",
  "contacto": "Juan Pérez",
  "telefono": "123-456-7890",
  "email": "[dirección de correo electrónico eliminada]"
}

HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "nombre": "Proveedor Ejemplo",
  "contacto": "Juan Pérez",
  "telefono": "123-456-7890",
  "email": "[dirección de correo electrónico eliminada]"
}

# API de Ajuste de Inventario

Este endpoint permite ajustar el inventario de un producto, registrando un movimiento de ajuste y actualizando el stock del producto en la base de datos.

## Endpoints

* `POST /api/inventario/ajuste`: Ajusta el inventario de un producto.

## Requisitos Previos

* Base de datos PostgreSQL configurada con las tablas `Movimientos` y `Productos`.
* Las tablas deben tener las siguientes relaciones:
    * `Movimientos.producto_id` referencia a `Productos.id`
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Ajuste de Inventario

1.  El cliente envía una solicitud `POST` al endpoint `/api/inventario/ajuste` con el ID del producto y la cantidad de ajuste en el cuerpo de la solicitud (formato JSON).
2.  El servidor inserta un nuevo movimiento de ajuste en la tabla `Movimientos`.
3.  El servidor actualiza el stock del producto en la tabla `Productos`, sumando la cantidad de ajuste al stock actual.
4.  El servidor devuelve un mensaje de éxito con un código de estado 200.

## Detalles del Código

### Validación de Entrada

* El código verifica que el método de la solicitud sea `POST`.
* No se realizan validaciones de formato específicas para los campos `producto_id` y `cantidad`, pero se recomienda agregar validaciones adicionales según los requisitos.

### Inserción y Actualización en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar consultas SQL `INSERT` y `UPDATE`.
* Primero, se inserta un nuevo movimiento de ajuste en la tabla `Movimientos`.
* Luego, se actualiza el stock del producto en la tabla `Productos`.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.

## Ejemplo de Solicitud

```json
POST /api/inventario/ajuste
Content-Type: application/json

{
  "producto_id": 1,
  "cantidad": 10
}


HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Inventario ajustado correctamente"
}

# API de Acciones Rápidas de Inventario

Este endpoint permite realizar acciones rápidas sobre el inventario de un producto específico (producto con `producto_id` 1 en este caso), incluyendo ajustes, entradas y salidas.

## Endpoints

* `POST /api/inventario/acciones/{action}`: Realiza una acción rápida de inventario.

## Parámetros de Ruta

* `{action}`: Tipo de acción a realizar (`ajuste`, `entrada`, `salida`).

## Requisitos Previos

* Base de datos PostgreSQL configurada con la tabla `Movimientos`.
* La tabla `Movimientos` debe contener los campos `producto_id`, `tipo` y `cantidad`.
* `../../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **400 Bad Request:**
    * Acción no válida.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Acciones Rápidas de Inventario

1.  El cliente envía una solicitud `POST` al endpoint `/api/inventario/acciones/{action}` con la cantidad en el cuerpo de la solicitud (formato JSON).
2.  El servidor valida el tipo de acción proporcionado en el parámetro de ruta.
3.  El servidor inserta un nuevo movimiento en la tabla `Movimientos` con el tipo de acción y la cantidad proporcionada.
4.  El servidor devuelve un mensaje de éxito con un código de estado 200.

## Detalles del Código

### Validación de Entrada

* El código verifica que el parámetro de ruta `action` sea uno de los valores válidos (`ajuste`, `entrada`, `salida`).
* Si el parámetro `action` no es válido, se devuelve un error 400.

### Inserción en la Base de Datos

* Se utiliza la función `query` del módulo `../../../../lib/db` para ejecutar una consulta SQL `INSERT` en la tabla `Movimientos`.
* El `producto_id` está hardcodeado a 1 en este ejemplo.
* El `tipo` se determina por el parámetro `action`.
* La `cantidad` se obtiene del cuerpo de la solicitud.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor, pero no se envían al cliente por motivos de seguridad.

## Ejemplos de Solicitud

### Ajuste de Inventario

```json
POST /api/inventario/acciones/ajuste
Content-Type: application/json

{
  "cantidad": 10
}
POST /api/inventario/acciones/entrada
Content-Type: application/json

{
  "cantidad": 20
}
POST /api/inventario/acciones/salida
Content-Type: application/json

{
  "cantidad": 5
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Acción realizada con éxito"
}

# API de Generación de Reportes de Movimientos

Este endpoint permite generar un reporte que resume la cantidad total de movimientos por producto y tipo (entrada, salida, ajuste).

## Endpoints

* `GET /api/reportes/movimientos`: Genera un reporte de movimientos.

## Requisitos Previos

* Base de datos PostgreSQL configurada con la tabla `Movimientos`.
* La tabla `Movimientos` debe contener los campos `producto_id`, `tipo` y `cantidad`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a GET.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Generación de Reporte de Movimientos

1.  El cliente realiza una solicitud `GET` al endpoint `/api/reportes/movimientos`.
2.  El servidor ejecuta una consulta SQL para obtener el reporte, agrupando los movimientos por `producto_id` y `tipo`, y sumando las cantidades.
3.  El servidor devuelve el reporte en formato JSON con un código de estado 200.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT` con `SUM` y `GROUP BY` para obtener el reporte.
* La consulta agrupa los movimientos por `producto_id` y `tipo`, y suma las cantidades para obtener el total por grupo.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Reporte Generado Correctamente",
  "data": {
    "rows": [
      {
        "producto_id": 1,
        "tipo": "entrada",
        "total": 100
      },
      {
        "producto_id": 1,
        "tipo": "salida",
        "total": 50
      },
      {
        "producto_id": 2,
        "tipo": "ajuste",
        "total": 20
      },
      // ... otros resultados
    ]
  }
}

# API de Estadísticas de Stock Bajo

Este endpoint permite obtener el número de productos que tienen un stock inferior a 10.

## Endpoints

* `GET /api/stats/low-stock`: Obtiene el número de productos con stock bajo.

## Requisitos Previos

* Base de datos PostgreSQL configurada con la tabla `productos`.
* La tabla `productos` debe contener el campo `stock`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Obtener Estadísticas de Stock Bajo

1.  El cliente realiza una solicitud `GET` al endpoint `/api/stats/low-stock`.
2.  El servidor ejecuta una consulta SQL para contar el número de productos cuyo stock es inferior a 10.
3.  El servidor devuelve el resultado en formato JSON con un código de estado 200.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT COUNT(*)` con una cláusula `WHERE` para contar los productos con stock inferior a 10.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500 y el mensaje de error del servidor.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "count": 5
}

# API de Estadísticas de Productos

Este endpoint permite obtener el total de stock de productos y una lista de productos con su nombre y stock, ordenados por stock descendente.

## Endpoints

* `GET /api/stats/products`: Obtiene estadísticas de productos.

## Requisitos Previos

* Base de datos PostgreSQL configurada con la tabla `productos`.
* La tabla `productos` debe contener los campos `nombre` y `stock`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Obtener Estadísticas de Productos

1.  El cliente realiza una solicitud `GET` al endpoint `/api/stats/products`.
2.  El servidor ejecuta una consulta SQL para obtener los nombres y el stock de los productos con stock mayor a 0, ordenados por stock descendente.
3.  El servidor calcula el total de stock sumando el stock de todos los productos obtenidos.
4.  El servidor devuelve el total de stock y la lista de productos en formato JSON con un código de estado 200.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT nombre, stock` con una cláusula `WHERE stock > 0` y `ORDER BY stock DESC` para obtener los productos con stock positivo, ordenados por stock descendente.

### Cálculo del Total de Stock

* Se utiliza el método `reduce` para sumar el stock de todos los productos obtenidos de la consulta SQL.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500 y el mensaje de error del servidor.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "total": 150,
  "data": [
    {
      "nombre": "Producto A",
      "stock": 50
    },
    {
      "nombre": "Producto B",
      "stock": 40
    },
    {
      "nombre": "Producto C",
      "stock": 30
    },
    {
      "nombre": "Producto D",
      "stock": 30
    }
  ]
}
# API de Estadísticas de Ventas (Últimos 30 Días)

Este endpoint permite obtener el total de ventas realizadas en los últimos 30 días.

## Endpoints

* `GET /api/stats/sales`: Obtiene el total de ventas de los últimos 30 días.

## Requisitos Previos

* Base de datos PostgreSQL configurada con la tabla `ventas`.
* La tabla `ventas` debe contener los campos `total` y `fecha`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Obtener Estadísticas de Ventas

1.  El cliente realiza una solicitud `GET` al endpoint `/api/stats/sales`.
2.  El servidor ejecuta una consulta SQL para sumar el total de ventas de la tabla `ventas` donde la fecha sea mayor o igual a 30 días antes de la fecha actual.
3.  El servidor devuelve el total de ventas en formato JSON con un código de estado 200.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT SUM(total)` con una cláusula `WHERE fecha >= NOW() - INTERVAL '30 DAYS'` para obtener el total de ventas de los últimos 30 días.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500 y el mensaje de error del servidor.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "total": 1500.50
}
# API de Obtención de Usuarios

Este endpoint permite obtener una lista de todos los usuarios registrados, mostrando su ID y nombre.

## Endpoints

* `GET /api/usuarios`: Obtiene una lista de usuarios.

## Requisitos Previos

* Base de datos PostgreSQL configurada con la tabla `Usuarios`.
* La tabla `Usuarios` debe contener los campos `id` y `nombre`.
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a GET.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Obtener Lista de Usuarios

1.  El cliente realiza una solicitud `GET` al endpoint `/api/usuarios`.
2.  El servidor ejecuta una consulta SQL para obtener todos los usuarios, seleccionando sus ID y nombres.
3.  El servidor devuelve la lista de usuarios en formato JSON con un código de estado 200.

## Detalles del Código

### Consulta SQL

* Se utiliza una consulta SQL `SELECT id, nombre` para obtener los ID y nombres de todos los usuarios.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Si ocurre un error, se devuelve un mensaje de error JSON con el código de estado 500 y un mensaje de error descriptivo.
* Se maneja el método 405 en caso de que se utilice otro método HTTP diferente a GET.

## Ejemplo de Respuesta Exitosa

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "nombre": "Usuario A"
  },
  {
    "id": 2,
    "nombre": "Usuario B"
  },
  {
    "id": 3,
    "nombre": "Usuario C"
  }
]
# API de Registro de Ventas

Este endpoint permite registrar una nueva venta en la base de datos, incluyendo los detalles de los productos vendidos y actualizando el stock de los productos.

## Endpoints

* `POST /api/ventas`: Registra una nueva venta.

## Requisitos Previos

* Base de datos PostgreSQL configurada con las tablas `ventas`, `detalle_ventas` y `productos`.
* Las tablas deben tener las siguientes relaciones:
    * `ventas.usuario_id` referencia a `Usuarios.id` (asumiendo que existe una tabla Usuarios)
    * `detalle_ventas.venta_id` referencia a `ventas.id`
    * `detalle_ventas.producto_id` referencia a `productos.id`
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **400 Bad Request:**
    * Datos de entrada inválidos (usuario_id, total, productos faltantes o con formato incorrecto).
    * Datos de producto inválidos (id, cantidad, precio faltantes).
    * Producto no encontrado.
    * Stock insuficiente para un producto.
* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Registro de Venta

1.  El cliente envía una solicitud `POST` al endpoint `/api/ventas` con los datos de la venta en el cuerpo de la solicitud (formato JSON).
2.  El servidor inicia una transacción en la base de datos.
3.  El servidor valida los datos de entrada y verifica el stock de cada producto.
4.  El servidor registra la venta en la tabla `ventas`.
5.  El servidor registra los detalles de la venta en la tabla `detalle_ventas`.
6.  El servidor actualiza el stock de los productos en la tabla `productos`.
7.  El servidor confirma la transacción.
8.  El servidor devuelve el ID de la venta registrada con un código de estado 201.
9.  En caso de error, el servidor revierte la transacción y devuelve un mensaje de error con un código de estado 500.

## Detalles del Código

### Validación de Entrada

* Se verifica que los campos `usuario_id`, `total` y `productos` estén presentes y tengan el formato correcto.
* Se verifica que los campos `id`, `cantidad` y `precio` de cada producto estén presentes.
* Se verifica que el producto exista y que haya suficiente stock disponible.

### Transacción

* Se utiliza `BEGIN`, `COMMIT` y `ROLLBACK` para asegurar la integridad de los datos en caso de errores.

### Inserción y Actualización en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar consultas SQL `INSERT` y `UPDATE`.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor.
* Si ocurre un error, se revierte la transacción y se devuelve un mensaje de error JSON con el código de estado 500.

## Ejemplo de Solicitud

```json
POST /api/ventas
Content-Type: application/json

{
  "usuario_id": 1,
  "total": 150.00,
  "productos": [
    {
      "id": 1,
      "cantidad": 2,
      "precio": 50.00
    },
    {
      "id": 2,
      "cantidad": 1,
      "precio": 50.00
    }
  ]
}
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1
}
# API de Registro de Ventas

Este endpoint permite registrar una nueva venta en la base de datos, incluyendo los detalles de los productos vendidos y actualizando el stock de los productos.

## Endpoints

* `POST /api/ventas`: Registra una nueva venta.

## Requisitos Previos

* Base de datos PostgreSQL configurada con las tablas `ventas`, `detalle_ventas` y `productos`.
* Las tablas deben tener las siguientes relaciones:
    * `ventas.usuario_id` referencia a `Usuarios.id` (asumiendo que existe una tabla Usuarios)
    * `detalle_ventas.venta_id` referencia a `ventas.id`
    * `detalle_ventas.producto_id` referencia a `productos.id`
* `../../../lib/db`: Módulo para interactuar con la base de datos PostgreSQL.

## Dependencias

* No hay dependencias externas específicas más allá del módulo de base de datos.

## Manejo de Errores

* **400 Bad Request:**
    * Datos de entrada inválidos (usuario_id, total, productos faltantes o con formato incorrecto).
    * Datos de producto inválidos (id, cantidad, precio faltantes).
    * Producto no encontrado.
    * Stock insuficiente para un producto.
* **405 Method Not Allowed:**
    * Se utiliza un método HTTP diferente a POST.
* **500 Internal Server Error:**
    * Error inesperado en el servidor.

## Registro de Venta

1.  El cliente envía una solicitud `POST` al endpoint `/api/ventas` con los datos de la venta en el cuerpo de la solicitud (formato JSON).
2.  El servidor inicia una transacción en la base de datos.
3.  El servidor valida los datos de entrada y verifica el stock de cada producto.
4.  El servidor registra la venta en la tabla `ventas`.
5.  El servidor registra los detalles de la venta en la tabla `detalle_ventas`.
6.  El servidor actualiza el stock de los productos en la tabla `productos`.
7.  El servidor confirma la transacción.
8.  El servidor devuelve el ID de la venta registrada con un código de estado 201.
9.  En caso de error, el servidor revierte la transacción y devuelve un mensaje de error con un código de estado 500.

## Detalles del Código

### Validación de Entrada

* Se verifica que los campos `usuario_id`, `total` y `productos` estén presentes y tengan el formato correcto.
* Se verifica que los campos `id`, `cantidad` y `precio` de cada producto estén presentes.
* Se verifica que el producto exista y que haya suficiente stock disponible.

### Transacción

* Se utiliza `BEGIN`, `COMMIT` y `ROLLBACK` para asegurar la integridad de los datos en caso de errores.

### Inserción y Actualización en la Base de Datos

* Se utiliza la función `query` del módulo `../../../lib/db` para ejecutar consultas SQL `INSERT` y `UPDATE`.

### Manejo de Errores

* Se utiliza un bloque `try...catch` para capturar errores y enviar respuestas de error adecuadas.
* Los detalles del error se registran en la consola del servidor.
* Si ocurre un error, se revierte la transacción y se devuelve un mensaje de error JSON con el código de estado 500.

## Ejemplo de Solicitud

```json
POST /api/ventas
Content-Type: application/json

{
  "usuario_id": 1,
  "total": 150.00,
  "productos": [
    {
      "id": 1,
      "cantidad": 2,
      "precio": 50.00
    },
    {
      "id": 2,
      "cantidad": 1,
      "precio": 50.00
    }
  ]
}
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1
}
# Módulo de Conexión a PostgreSQL

Este módulo proporciona una forma sencilla de conectarse a una base de datos PostgreSQL y ejecutar consultas. Utiliza el paquete `pg` para gestionar el pool de conexiones.

## Requisitos Previos

* Node.js instalado.
* Paquete `pg` instalado (`npm install pg`).
* Variable de entorno `DATABASE_URL` configurada con la cadena de conexión a la base de datos PostgreSQL.

## Configuración

1.  Asegúrate de que la variable de entorno `DATABASE_URL` esté configurada correctamente. Esta variable debe contener la cadena de conexión a tu base de datos PostgreSQL. Por ejemplo:

    ```bash
    DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basededatos
    ```

2.  Instala el paquete `pg`:

    ```bash
    npm install pg
    ```

## Uso

1.  Importa el módulo en tu archivo:

    ```javascript
    const { query, closePool } = require('./ruta/a/tu/modulo');
    ```

2.  Utiliza la función `query` para ejecutar consultas SQL:

    ```javascript
    async function ejecutarConsulta() {
      try {
        const resultado = await query('SELECT * FROM mi_tabla WHERE columna = $1', ['valor']);
        console.log(resultado.rows);
      } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
      }
    }

    ejecutarConsulta();
    ```

3.  Utiliza la función `closePool` para cerrar el pool de conexiones cuando ya no lo necesites:

    ```javascript
    async function cerrarConexion() {
      try {
        await closePool();
        console.log('Pool de conexiones cerrado');
      } catch (error) {
        console.error('Error al cerrar el pool:', error);
      }
    }

    cerrarConexion();
    ```

## Funciones

### `query(text, params)`

Ejecuta una consulta SQL en la base de datos.

* `text` (string): La cadena de consulta SQL.
* `params` (array, opcional): Un array de valores para parametrizar la consulta.

**Devuelve:** Una promesa que resuelve con el resultado de la consulta.

**Lanza:** Un error si la ejecución de la consulta falla.

### `closePool()`

Cierra el pool de conexiones a la base de datos.

**Devuelve:** Una promesa que resuelve cuando el pool se ha cerrado.

**Lanza:** Un error si el cierre del pool falla.

## Manejo de Errores

* Si la variable de entorno `DATABASE_URL` no está definida, el módulo lanzará un error al inicializarse.
* Si la conexión a la base de datos falla, la función `query` lanzará un error.
* Si la ejecución de la consulta falla, la función `query` lanzará el error correspondiente.
* Si el cierre del pool falla, la función `closePool` lanzará un error.

## Consideraciones Adicionales

* Asegúrate de manejar los errores adecuadamente en tu aplicación.
* Utiliza la parametrización de consultas para prevenir ataques de inyección SQL.
* Cierra el pool de conexiones cuando ya no lo necesites para liberar recursos.
* Ajusta los parámetros del pool (`max`, `idleTimeoutMillis`, `connectionTimeoutMillis`) según las necesidades de tu aplicación.


# Documentación Completa de la API de Gestión de Inventario y Ventas

Esta documentación describe todos los endpoints y el módulo de conexión a la base de datos para una API de gestión de inventario y ventas.

## Tabla de Contenidos

1.  [Módulo de Conexión a PostgreSQL](#módulo-de-conexión-a-postgresql)
2.  [Endpoints de Autenticación](#endpoints-de-autenticación)
    * [Autenticación de Usuarios (Login)](#autenticación-de-usuarios-login)
    * [Registro de Usuarios](#registro-de-usuarios)
3.  [Endpoints de Gestión de Productos](#endpoints-de-gestión-de-productos)
    * [Crear Producto](#crear-producto-post)
    * [Obtener Productos](#obtener-productos-get)
    * [Actualizar Producto](#actualizar-producto-put)
    * [Eliminar Producto](#eliminar-producto-delete)
4.  [Endpoints de Gestión de Categorías](#endpoints-de-gestión-de-categorías)
    * [Crear Categoría](#crear-categoría)
5.  [Endpoints de Gestión de Proveedores](#endpoints-de-gestión-de-proveedores)
    * [Crear Proveedor](#crear-proveedor)
6.  [Endpoints de Gestión de Movimientos](#endpoints-de-gestión-de-movimientos)
    * [Registrar Movimiento](#registrar-movimiento)
    * [Obtener Movimientos Recientes](#obtener-movimientos-recientes)
    * [Ajuste de Inventario](#ajuste-de-inventario)
    * [Acciones Rápidas de Inventario](#acciones-rápidas-de-inventario)
7.  [Endpoints de Reportes y Estadísticas](#endpoints-de-reportes-y-estadísticas)
    * [Generación de Reporte de Movimientos](#generación-de-reporte-de-movimientos)
    * [Estadísticas de Stock Bajo](#estadísticas-de-stock-bajo)
    * [Estadísticas de Productos](#estadísticas-de-productos)
    * [Estadísticas de Ventas](#estadísticas-de-ventas)
8.  [Endpoints de Gestión de Usuarios](#endpoints-de-gestión-de-usuarios)
    * [Obtener Lista de Usuarios](#obtener-lista-de-usuarios)
9.  [Endpoints de Gestión de Ventas](#endpoints-de-gestión-de-ventas)
    * [Registro de Venta](#registro-de-venta)

## Módulo de Conexión a PostgreSQL

Este módulo proporciona una forma sencilla de conectarse a una base de datos PostgreSQL y ejecutar consultas. Utiliza el paquete `pg` para gestionar el pool de conexiones.

### Requisitos Previos

* Node.js instalado.
* Paquete `pg` instalado (`npm install pg`).
* Variable de entorno `DATABASE_URL` configurada con la cadena de conexión a la base de datos PostgreSQL.

### Configuración

1.  Asegúrate de que la variable de entorno `DATABASE_URL` esté configurada correctamente.
2.  Instala el paquete `pg`:

    ```bash
    npm install pg
    ```

### Uso

1.  Importa el módulo en tu archivo:

    ```javascript
    const { query, closePool } = require('./ruta/a/tu/modulo');
    ```

2.  Utiliza la función `query` para ejecutar consultas SQL.
3.  Utiliza la función `closePool` para cerrar el pool de conexiones.

### Funciones

* `query(text, params)`: Ejecuta una consulta SQL.
* `closePool()`: Cierra el pool de conexiones.

### Manejo de Errores

* Manejo de errores para la variable de entorno `DATABASE_URL`, conexiones y consultas.

### Consideraciones Adicionales

* Utiliza la parametrización de consultas para prevenir ataques de inyección SQL.

## Endpoints de Autenticación

### Autenticación de Usuarios (Login)

* `POST /api/auth/login`: Autentica a un usuario y devuelve un token JWT.
* Manejo de intentos fallidos y protección contra fuerza bruta.

### Registro de Usuarios

* `POST /api/auth/register`: Registra un nuevo usuario.
* Validación de datos de entrada y hash de contraseñas.

## Endpoints de Gestión de Productos

### Crear Producto (POST)

* `POST /api/productos`: Crea un nuevo producto.
* Validación de datos de entrada.

### Obtener Productos (GET)

* `GET /api/productos`: Obtiene todos los productos.
* `GET /api/productos?id={id}`: Obtiene un producto específico por ID.

### Actualizar Producto (PUT)

* `PUT /api/productos?id={id}`: Actualiza un producto existente.
* Validación de datos de entrada.

### Eliminar Producto (DELETE)

* `DELETE /api/productos?id={id}`: Elimina un producto.

## Endpoints de Gestión de Categorías

### Crear Categoría

* `POST /api/categorias`: Crea una nueva categoría.

## Endpoints de Gestión de Proveedores

### Crear Proveedor

* `POST /api/proveedores`: Registra un nuevo proveedor.

## Endpoints de Gestión de Movimientos

### Registrar Movimiento

* `POST /api/movimientos`: Registra un nuevo movimiento.
* Validación de datos de entrada.

### Obtener Movimientos Recientes

* `GET /api/movimientos/recientes`: Obtiene los 10 movimientos más recientes.

### Ajuste de Inventario

* `POST /api/inventario/ajuste`: Ajusta el inventario de un producto.

### Acciones Rápidas de Inventario

* `POST /api/inventario/acciones/{action}`: Realiza una acción rápida de inventario.

## Endpoints de Reportes y Estadísticas

### Generación de Reporte de Movimientos

* `GET /api/reportes/movimientos`: Genera un reporte de movimientos.

### Estadísticas de Stock Bajo

* `GET /api/stats/low-stock`: Obtiene el número de productos con stock bajo.

### Estadísticas de Productos

* `GET /api/stats/products`: Obtiene estadísticas de productos.

### Estadísticas de Ventas

* `GET /api/stats/sales`: Obtiene el total de ventas de los últimos 30 días.

## Endpoints de Gestión de Usuarios

### Obtener Lista de Usuarios

* `GET /api/usuarios`: Obtiene una lista de usuarios.

## Endpoints de Gestión de Ventas

### Registro de Venta

* `POST /api/ventas`: Registra una nueva venta.
* Validación de datos de entrada, verificación de stock y manejo de transacciones.

## Manejo de Errores General

* Códigos de estado HTTP para errores comunes (400, 401, 404, 405, 500).
* Mensajes de error descriptivos en formato JSON.
* Registro de errores en la consola del servidor.

## Consideraciones de Seguridad Adicionales

* Sanitización y validación de entradas de usuario.
* Uso de HTTPS.
* Protección contra inyección SQL.
* Control de acceso basado en roles (si aplica).
* Manejo de variables de entorno seguras.
* Transacciones de base de datos para operaciones críticas.
* Validaciones de datos extra para ventas.

Esta documentación proporciona una visión completa de la API, incluyendo detalles de cada endpoint, manejo de errores y consideraciones de seguridad.