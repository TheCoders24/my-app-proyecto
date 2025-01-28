Aquí tienes una versión actualizada y robusta de tu base de datos de inventario, incorporando las mejoras sugeridas y asegurando un diseño sólido, escalable y seguro:

---

### **Esquema de la Base de Datos Actualizado**

```sql
-- Tabla de Roles (para gestión flexible de roles)
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla de Usuarios (con encriptación de contraseñas y roles)
CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(512) NOT NULL, -- Contraseña encriptada
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación Usuarios-Roles (para asignar múltiples roles a un usuario)
CREATE TABLE Usuarios_Roles (
    usuario_id INT REFERENCES Usuarios(id) ON DELETE CASCADE,
    rol_id INT REFERENCES Roles(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

-- Tabla de Categorías (para clasificar productos)
CREATE TABLE Categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Proveedores (con validación de email y teléfono)
CREATE TABLE Proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20) CHECK (telefono ~ '^[0-9]{10}$'), -- Validación de teléfono
    email VARCHAR(100) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$') -- Validación de email
);

-- Tabla de Productos (con relaciones a categorías y proveedores)
CREATE TABLE Productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    categoria_id INT REFERENCES Categorias(id) ON DELETE SET NULL,
    proveedor_id INT REFERENCES Proveedores(id) ON DELETE SET NULL
);

-- Tabla de Movimientos (para registrar entradas, salidas y ajustes de inventario)
CREATE TABLE Movimientos (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    tipo VARCHAR(20) CHECK (tipo IN ('entrada', 'salida', 'ajuste')) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL
);

-- Tabla de Ventas (para registrar transacciones de ventas)
CREATE TABLE Ventas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL
);

-- Tabla de Detalle de Ventas (para registrar los productos vendidos en cada venta)
CREATE TABLE Detalle_Ventas (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL REFERENCES Ventas(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0)
);

-- Tabla de Auditoría (para rastrear cambios en las tablas críticas)
CREATE TABLE Auditoria (
    id SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(100) NOT NULL,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
    id_registro INT NOT NULL,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT
);
```

---

### **Índices para Mejorar el Rendimiento**

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_productos_nombre ON Productos(nombre);
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_movimientos_fecha ON Movimientos(fecha);
CREATE INDEX idx_ventas_fecha ON Ventas(fecha);
```

---

### **Triggers para Automatización**

1. **Trigger para actualizar el stock después de un movimiento:**

```sql
CREATE OR REPLACE FUNCTION actualizar_stock() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'entrada' THEN
        UPDATE Productos SET stock = stock + NEW.cantidad WHERE id = NEW.producto_id;
    ELSIF NEW.tipo = 'salida' THEN
        UPDATE Productos SET stock = stock - NEW.cantidad WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON Movimientos
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock();
```

2. **Trigger para registrar cambios en la tabla de Auditoría:**

```sql
CREATE OR REPLACE FUNCTION registrar_auditoria() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO Auditoria (tabla_afectada, accion, id_registro, usuario_id, detalles)
        VALUES (TG_TABLE_NAME, 'INSERT', NEW.id, NEW.usuario_id, row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO Auditoria (tabla_afectada, accion, id_registro, usuario_id, detalles)
        VALUES (TG_TABLE_NAME, 'UPDATE', NEW.id, NEW.usuario_id, row_to_json(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO Auditoria (tabla_afectada, accion, id_registro, usuario_id, detalles)
        VALUES (TG_TABLE_NAME, 'DELETE', OLD.id, OLD.usuario_id, row_to_json(OLD));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a las tablas críticas
CREATE TRIGGER trg_auditoria_usuarios
AFTER INSERT OR UPDATE OR DELETE ON Usuarios
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trg_auditoria_productos
AFTER INSERT OR UPDATE OR DELETE ON Productos
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trg_auditoria_movimientos
AFTER INSERT OR UPDATE OR DELETE ON Movimientos
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria();
```

---

### **Ejemplo de Datos Iniciales**

```sql
-- Insertar roles
INSERT INTO Roles (nombre) VALUES ('admin'), ('empleado');

-- Insertar un usuario
INSERT INTO Usuarios (nombre, email, password) 
VALUES ('Juan Perez', 'juan@example.com', 'hashed_password_123');

-- Asignar rol al usuario
INSERT INTO Usuarios_Roles (usuario_id, rol_id) 
VALUES (1, (SELECT id FROM Roles WHERE nombre = 'admin'));

-- Insertar categorías
INSERT INTO Categorias (nombre) VALUES ('Electrónicos'), ('Ropa');

-- Insertar proveedores
INSERT INTO Proveedores (nombre, contacto, telefono, email)
VALUES ('Proveedor A', 'Carlos Gómez', '1234567890', 'carlos@proveedora.com');

-- Insertar productos
INSERT INTO Productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id)
VALUES ('Laptop', 'Laptop de última generación', 1200.00, 10, 1, 1);

-- Insertar un movimiento de entrada
INSERT INTO Movimientos (producto_id, tipo, cantidad, usuario_id)
VALUES (1, 'entrada', 5, 1);
```

---

### **Consideraciones Finales**
1. **Seguridad**: Asegúrate de que las contraseñas se almacenen encriptadas (usando algoritmos como bcrypt).
2. **Backups**: Configura backups automáticos de la base de datos.
3. **Transacciones**: Usa transacciones para operaciones críticas (como ventas y movimientos).
4. **Escalabilidad**: Si el sistema crece, considera particionar tablas grandes (como `Movimientos` o `Auditoria`).

Este diseño es robusto, seguro y escalable, listo para manejar un sistema de inventario en producción.