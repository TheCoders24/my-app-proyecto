Aquí tienes todo el contenido anterior en formato **Markdown** para que puedas copiarlo y usarlo fácilmente en tu documentación o notas.

---

# Sistema de Inventario Robusto

Este documento describe la estructura de la base de datos, procedimientos almacenados, triggers, vistas y la integración con un dashboard en **Next.js** para un sistema de inventario robusto.

---

## **1. Estructura de la Base de Datos**

### Tablas Principales

#### **Usuarios**
Almacena información de los usuarios del sistema.

```sql
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado') DEFAULT 'empleado',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Categorías**
Clasifica los productos en categorías.

```sql
CREATE TABLE Categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
```

#### **Proveedores**
Almacena información de los proveedores.

```sql
CREATE TABLE Proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT,
    proveedor_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id)
);
```

#### **Movimientos**
Registra los movimientos de inventario (entradas, salidas, ajustes).

```sql
CREATE TABLE Movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('entrada', 'salida', 'ajuste') NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    FOREIGN KEY (producto_id) REFERENCES Productos(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);
```

#### **Ventas**
Registra las ventas de productos.

```sql
CREATE TABLE Ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);
```

#### **Detalle_Ventas**
Almacena los detalles de cada venta (productos vendidos).

```sql
CREATE TABLE Detalle_Ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES Ventas(id),
    FOREIGN KEY (producto_id) REFERENCES Productos(id)
);
```

---

## **2. Procedimientos Almacenados**

### **Registrar un nuevo producto**

```sql
DELIMITER //
CREATE PROCEDURE RegistrarProducto(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_precio DECIMAL(10, 2),
    IN p_stock INT,
    IN p_categoria_id INT,
    IN p_proveedor_id INT
)
BEGIN
    INSERT INTO Productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id)
    VALUES (p_nombre, p_descripcion, p_precio, p_stock, p_categoria_id, p_proveedor_id);
END //
DELIMITER ;
```

### **Registrar un movimiento de inventario**

```sql
DELIMITER //
CREATE PROCEDURE RegistrarMovimiento(
    IN p_producto_id INT,
    IN p_tipo ENUM('entrada', 'salida', 'ajuste'),
    IN p_cantidad INT,
    IN p_usuario_id INT
)
BEGIN
    -- Registrar el movimiento
    INSERT INTO Movimientos (producto_id, tipo, cantidad, usuario_id)
    VALUES (p_producto_id, p_tipo, p_cantidad, p_usuario_id);

    -- Actualizar el stock del producto
    IF p_tipo = 'entrada' THEN
        UPDATE Productos SET stock = stock + p_cantidad WHERE id = p_producto_id;
    ELSEIF p_tipo = 'salida' THEN
        UPDATE Productos SET stock = stock - p_cantidad WHERE id = p_producto_id;
    END IF;
END //
DELIMITER ;
```

---

## **3. Triggers**

### **Actualizar stock después de una venta**

```sql
DELIMITER //
CREATE TRIGGER ActualizarStockDespuesVenta
AFTER INSERT ON Detalle_Ventas
FOR EACH ROW
BEGIN
    UPDATE Productos
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.producto_id;
END //
DELIMITER ;
```

### **Verificar stock antes de una venta**

```sql
DELIMITER //
CREATE TRIGGER VerificarStockAntesVenta
BEFORE INSERT ON Detalle_Ventas
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    SELECT stock INTO v_stock FROM Productos WHERE id = NEW.producto_id;
    IF v_stock < NEW.cantidad THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;
END //
DELIMITER ;
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
       DATE_FORMAT(fecha, '%Y-%m') AS mes,
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

Este diseño de base de datos y las funcionalidades avanzadas (procedimientos almacenados, triggers, vistas) proporcionan una base sólida para un **sistema de inventario robusto**.
--- 
