
-- Crear tabla de Usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Crear tabla de Productos
CREATE TABLE producto (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio NUMERIC(10, 2) NOT NULL,
    cantidad_en_inventario INT NOT NULL
);

-- Crear tabla de Clientes
CREATE TABLE cliente (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(15)
);

-- Crear tabla de Ventas
CREATE TABLE venta (
    venta_id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_id INT,
    user_id INT,
    FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Crear tabla de Detalle de Venta
CREATE TABLE detalle_venta (
    detalle_venta_id SERIAL PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (venta_id) REFERENCES venta(venta_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(producto_id) ON DELETE CASCADE
);