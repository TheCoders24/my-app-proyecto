Aquí tienes el contenido anterior adaptado para **PostgreSQL** en formato **Markdown**:

---

# Sistema de Inventario Robusto (PostgreSQL)

Este documento describe la estructura de la base de datos, procedimientos almacenados, triggers, vistas y la integración con un dashboard en **Next.js** para un sistema de inventario robusto utilizando **PostgreSQL**.

---

## **1. Estructura de la Base de Datos**

### Tablas Principales

#### **Usuarios**
Almacena información de los usuarios del sistema.

```sql
CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'empleado')) DEFAULT 'empleado',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Categorías**
Clasifica los productos en categorías.

```sql
CREATE TABLE Categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
```

#### **Proveedores**
Almacena información de los proveedores.

```sql
CREATE TABLE Proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100)
);
```

#### **Productos**
Almacena información de los productos en el inventario.

```sql
CREATE TABLE Productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT REFERENCES Categorias(id) ON DELETE SET NULL,
    proveedor_id INT REFERENCES Proveedores(id) ON DELETE SET NULL
);
```

#### **Movimientos**
Registra los movimientos de inventario (entradas, salidas, ajustes).

```sql
CREATE TABLE Movimientos (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    tipo VARCHAR(20) CHECK (tipo IN ('entrada', 'salida', 'ajuste')) NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL
);
```

#### **Ventas**
Registra las ventas de productos.

```sql
CREATE TABLE Ventas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE SET NULL
);
```

#### **Detalle_Ventas**
Almacena los detalles de cada venta (productos vendidos).

```sql
CREATE TABLE Detalle_Ventas (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL REFERENCES Ventas(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES Productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
);
```

---

## **2. Procedimientos Almacenados**

### **Registrar un nuevo producto**

```sql
CREATE OR REPLACE FUNCTION RegistrarProducto(
    p_nombre VARCHAR(100),
    p_descripcion TEXT,
    p_precio DECIMAL(10, 2),
    p_stock INT,
    p_categoria_id INT,
    p_proveedor_id INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO Productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id)
    VALUES (p_nombre, p_descripcion, p_precio, p_stock, p_categoria_id, p_proveedor_id);
END;
$$ LANGUAGE plpgsql;
```

### **Registrar un movimiento de inventario**

```sql
CREATE OR REPLACE FUNCTION RegistrarMovimiento(
    p_producto_id INT,
    p_tipo VARCHAR(20),
    p_cantidad INT,
    p_usuario_id INT
)
RETURNS VOID AS $$
BEGIN
    -- Registrar el movimiento
    INSERT INTO Movimientos (producto_id, tipo, cantidad, usuario_id)
    VALUES (p_producto_id, p_tipo, p_cantidad, p_usuario_id);

    -- Actualizar el stock del producto
    IF p_tipo = 'entrada' THEN
        UPDATE Productos SET stock = stock + p_cantidad WHERE id = p_producto_id;
    ELSIF p_tipo = 'salida' THEN
        UPDATE Productos SET stock = stock - p_cantidad WHERE id = p_producto_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## **3. Triggers**

### **Actualizar stock después de una venta**

```sql
CREATE OR REPLACE FUNCTION ActualizarStockDespuesVenta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Productos
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.producto_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER Trigger_ActualizarStockDespuesVenta
AFTER INSERT ON Detalle_Ventas
FOR EACH ROW
EXECUTE FUNCTION ActualizarStockDespuesVenta();
```

### **Verificar stock antes de una venta**

```sql
CREATE OR REPLACE FUNCTION VerificarStockAntesVenta()
RETURNS TRIGGER AS $$
DECLARE
    v_stock INT;
BEGIN
    SELECT stock INTO v_stock FROM Productos WHERE id = NEW.producto_id;
    IF v_stock < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER Trigger_VerificarStockAntesVenta
BEFORE INSERT ON Detalle_Ventas
FOR EACH ROW
EXECUTE FUNCTION VerificarStockAntesVenta();
```

---

## **4. Vistas**

### **Vista de productos con categoría y proveedor**

```sql
CREATE VIEW Vista_Productos AS
SELECT 
    p.id,
    p.nombre AS producto,
    p.descripcion,
    p.precio,
    p.stock,
    c.nombre AS categoria,
    pr.nombre AS proveedor
FROM Productos p
JOIN Categorias c ON p.categoria_id = c.id
JOIN Proveedores pr ON p.proveedor_id = pr.id;
```

### **Vista de movimientos de inventario**

```sql
CREATE VIEW Vista_Movimientos AS
SELECT 
    m.id,
    p.nombre AS producto,
    m.tipo,
    m.cantidad,
    m.fecha,
    u.nombre AS usuario
FROM Movimientos m
JOIN Productos p ON m.producto_id = p.id
JOIN Usuarios u ON m.usuario_id = u.id;
```

---

## **5. Dashboard**

### Consultas para el Dashboard

1. **Total de productos en inventario**:
   ```sql
   SELECT SUM(stock) AS total_stock FROM Productos;
   ```

2. **Productos con stock bajo**:
   ```sql
   SELECT nombre, stock FROM Productos WHERE stock < 10;
   ```

3. **Ventas totales por mes**:
   ```sql
   SELECT 
       TO_CHAR(fecha, 'YYYY-MM') AS mes,
       SUM(total) AS ventas_totales
   FROM Ventas
   GROUP BY mes;
   ```

4. **Movimientos recientes**:
   ```sql
   SELECT * FROM Vista_Movimientos ORDER BY fecha DESC LIMIT 10;
   ```

---

## **Conclusión**

Este diseño de base de datos y las funcionalidades avanzadas (procedimientos almacenados, triggers, vistas) proporcionan una base sólida para un **sistema de inventario robusto** en **PostgreSQL**. Además, la integración con Next.js permite crear un **dashboard** dinámico y funcional. Puedes expandir este sistema agregando más características, como reportes, notificaciones de stock bajo, y más. ¡Espero que esto te sea útil! 😊

--- 

**Nota**: Copia este contenido en un archivo `.md` para usarlo en tu documentación.