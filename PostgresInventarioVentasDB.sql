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

--agregar a la tabla Usuarios 
ALTER TABLE Usuarios
ADD COLUMN usuario_id INTEGER;

-- Tabla de relación Usuarios-Roles (para asignar múltiples roles a un usuario)
CREATE TABLE Usuarios_Roles (
    usuario_id INT REFERENCES Usuarios(id) ON DELETE CASCADE,
    rol_id INT REFERENCES Roles(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE Devoluciones (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL REFERENCES Ventas(id) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL
);

CREATE TABLE Metricas (
    id SERIAL PRIMARY KEY,
    tipo_metrica VARCHAR(50) NOT NULL,
    valor TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RegistroActividad (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(50) NOT NULL
);

CREATE TABLE Sesiones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES Usuarios(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE Detalle_Devoluciones (
    id SERIAL PRIMARY KEY,
    devolucion_id INT NOT NULL REFERENCES Devoluciones(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0)
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


-- Índices para búsquedas frecuentes
CREATE INDEX idx_productos_nombre ON Productos(nombre);
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_movimientos_fecha ON Movimientos(fecha);
CREATE INDEX idx_ventas_fecha ON Ventas(fecha);



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

CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON Movimientos
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock();

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


CREATE INDEX idx_productos_nombre ON Productos(nombre);
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_movimientos_fecha ON Movimientos(fecha);
CREATE INDEX idx_ventas_fecha ON Ventas(fecha);

CREATE TABLE Configuraciones (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descripcion TEXT
);

-- Ejemplo de datos iniciales
INSERT INTO Configuraciones (clave, valor, descripcion)
VALUES 
    ('IVA', '16', 'Impuesto al Valor Agregado'),
    ('MONEDA', 'USD', 'Moneda predeterminada del sistema');

CREATE TABLE Historial_Precios (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    precio_anterior DECIMAL(10, 2) NOT NULL,
    precio_nuevo DECIMAL(10, 2) NOT NULL,
    fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL
);

-- Trigger para registrar cambios de precio
CREATE OR REPLACE FUNCTION registrar_cambio_precio() RETURNS TRIGGER AS $$ 
BEGIN
    IF OLD.precio IS DISTINCT FROM NEW.precio THEN
        INSERT INTO Historial_Precios (producto_id, precio_anterior, precio_nuevo, usuario_id)
        VALUES (NEW.id, OLD.precio, NEW.precio, NEW.usuario_id);
    END IF; 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cambio_precio 
AFTER UPDATE ON Productos 
FOR EACH ROW 
EXECUTE FUNCTION registrar_cambio_precio();

CREATE TABLE Pedidos_Proveedores (
    id SERIAL PRIMARY KEY,
    proveedor_id INT NOT NULL REFERENCES Proveedores(id) ON DELETE CASCADE,
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0)
);

CREATE TABLE Detalle_Pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL REFERENCES Pedidos_Proveedores(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0)
);




CREATE VIEW Reporte_Ventas AS
SELECT 
    V.id AS venta_id,
    V.fecha,
    V.total,
    U.nombre AS usuario,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'producto', P.nombre,
            'cantidad', DV.cantidad,
            'precio', DV.precio
        )
    ) AS productos
FROM Ventas V
JOIN Usuarios U ON V.usuario_id = U.id
JOIN Detalle_Ventas DV ON V.id = DV.venta_id
JOIN Productos P ON DV.producto_id = P.id
GROUP BY V.id, V.fecha, V.total, U.nombre;



CREATE OR REPLACE FUNCTION realizar_venta(
    p_usuario_id INT,
    p_productos JSON
) RETURNS INT AS $$
DECLARE
    v_venta_id INT;
    v_total DECIMAL(10, 2) := 0;
    v_producto JSON;
BEGIN
    -- Crear la venta
    INSERT INTO Ventas (total, usuario_id) VALUES (0, p_usuario_id)
    RETURNING id INTO v_venta_id;

    -- Procesar cada producto
    FOR v_producto IN SELECT * FROM json_array_elements(p_productos) LOOP
        INSERT INTO Detalle_Ventas (venta_id, producto_id, cantidad, precio)
        VALUES (
            v_venta_id,
            (v_producto->>'producto_id')::INT,
            (v_producto->>'cantidad')::INT,
            (SELECT precio FROM Productos WHERE id = (v_producto->>'producto_id')::INT)
        );

        -- Actualizar el total
        v_total := v_total + ((v_producto->>'cantidad')::INT * (SELECT precio FROM Productos WHERE id = (v_producto->>'producto_id')::INT));

        -- Actualizar el stock
        UPDATE Productos SET stock = stock - (v_producto->>'cantidad')::INT
        WHERE id = (v_producto->>'producto_id')::INT;
    END LOOP;

    -- Actualizar el total de la venta
    UPDATE Ventas SET total = v_total WHERE id = v_venta_id;

    RETURN v_venta_id;
END;
$$ LANGUAGE plpgsql;


COMMENT ON TABLE Usuarios IS 'Tabla que almacena la información de los usuarios del sistema.';
COMMENT ON COLUMN Usuarios.password IS 'Contraseña encriptada del usuario.';


CREATE TABLE Detalle_Pedidos_Proveedores (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL REFERENCES Pedidos_Proveedores(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0)
);







