Implementar **ingeniería de software** en el desarrollo de una API REST implica aplicar principios y prácticas que aseguren la calidad, mantenibilidad, escalabilidad y reutilización del código. Esto incluye:

1. **Modularización**: Dividir el código en módulos o componentes bien definidos.
2. **Separación de responsabilidades**: Aplicar el principio de responsabilidad única (SRP) para que cada módulo tenga una tarea específica.
3. **Uso de patrones de diseño**: Implementar patrones como MVC (Modelo-Vista-Controlador) o Repository para organizar mejor el código.
4. **Manejo de errores robusto**: Asegurar que los errores sean manejados de manera clara y consistente.
5. **Pruebas unitarias y de integración**: Escribir pruebas para validar el comportamiento del sistema.
6. **Documentación**: Proporcionar documentación clara para facilitar el uso y mantenimiento.
7. **Control de versiones**: Usar herramientas como Git para gestionar cambios en el código.
8. **Seguridad**: Implementar medidas para proteger la API contra vulnerabilidades comunes.

A continuación, refactorizaremos el código anterior aplicando estos principios de ingeniería de software.

---

### 1. Estructura del proyecto

Vamos a modularizar el proyecto para seguir buenas prácticas de ingeniería de software:

```
mi_api/
│
├── app.py               # Archivo principal de la aplicación
├── models/              # Módulo para manejar la lógica de datos
│   ├── __init__.py
│   ├── product_model.py
│   ├── category_model.py
│   ├── user_model.py
│   └── movement_model.py
├── controllers/         # Módulo para manejar las rutas y lógica de negocio
│   ├── __init__.py
│   ├── product_controller.py
│   ├── category_controller.py
│   ├── user_controller.py
│   └── movement_controller.py
├── services/            # Módulo para servicios adicionales (notificaciones, estadísticas)
│   ├── __init__.py
│   ├── notification_service.py
│   └── stats_service.py
├── tests/               # Pruebas unitarias y de integración
│   ├── test_products.py
│   └── test_categories.py
├── requirements.txt     # Dependencias del proyecto
└── README.md            # Documentación del proyecto
```

---

### 2. Modularización del código

#### `models/product_model.py`

Este archivo contiene la lógica relacionada con los productos.

```python
# models/product_model.py

products = [
    {"id": 1, "name": "Producto A", "category_id": 1, "price": 10.99, "stock": 50},
    {"id": 2, "name": "Producto B", "category_id": 2, "price": 20.49, "stock": 20},
]

def get_all_products():
    return products

def get_product_by_id(product_id):
    return next((p for p in products if p['id'] == product_id), None)

def create_product(name, category_id, price, stock):
    new_product = {
        'id': products[-1]['id'] + 1 if products else 1,
        'name': name,
        'category_id': category_id,
        'price': price,
        'stock': stock
    }
    products.append(new_product)
    return new_product

def update_product(product_id, name=None, category_id=None, price=None, stock=None):
    product = get_product_by_id(product_id)
    if product:
        product['name'] = name or product['name']
        product['category_id'] = category_id or product['category_id']
        product['price'] = price or product['price']
        product['stock'] = stock or product['stock']
    return product

def delete_product(product_id):
    product = get_product_by_id(product_id)
    if product:
        products.remove(product)
        return True
    return False
```

---

#### `controllers/product_controller.py`

Este archivo contiene las rutas y lógica de negocio para los productos.

```python
# controllers/product_controller.py

from flask import jsonify, request, abort
from models.product_model import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product
)

def register_product_routes(app):

    @app.route('/api/products', methods=['GET'])
    def get_products():
        return jsonify({'products': get_all_products()})

    @app.route('/api/products/<int:product_id>', methods=['GET'])
    def get_product(product_id):
        product = get_product_by_id(product_id)
        if not product:
            abort(404)
        return jsonify({'product': product})

    @app.route('/api/products', methods=['POST'])
    def create_new_product():
        if not request.json or not 'name' in request.json:
            abort(400)
        product = create_product(
            name=request.json['name'],
            category_id=request.json.get('category_id'),
            price=request.json.get('price'),
            stock=request.json.get('stock')
        )
        return jsonify({'product': product}), 201

    @app.route('/api/products/<int:product_id>', methods=['PUT'])
    def update_existing_product(product_id):
        product = update_product(
            product_id=product_id,
            name=request.json.get('name'),
            category_id=request.json.get('category_id'),
            price=request.json.get('price'),
            stock=request.json.get('stock')
        )
        if not product:
            abort(404)
        return jsonify({'product': product})

    @app.route('/api/products/<int:product_id>', methods=['DELETE'])
    def delete_existing_product(product_id):
        success = delete_product(product_id)
        if not success:
            abort(404)
        return jsonify({'result': True})
```

---

#### `app.py`

El archivo principal ahora solo registra las rutas y configura la aplicación.

```python
# app.py

from flask import Flask
from controllers.product_controller import register_product_routes

app = Flask(__name__)

# Registrar rutas
register_product_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
```

---

### 3. Pruebas unitarias

#### `tests/test_products.py`

Ejemplo de prueba unitaria para los productos.

```python
# tests/test_products.py

import unittest
from models.product_model import (
    get_all_products,
    create_product,
    update_product,
    delete_product
)

class TestProductModel(unittest.TestCase):

    def setUp(self):
        self.initial_products = get_all_products()

    def test_create_product(self):
        create_product("Producto C", 1, 15.99, 30)
        self.assertEqual(len(get_all_products()), len(self.initial_products) + 1)

    def test_update_product(self):
        product_id = self.initial_products[0]['id']
        update_product(product_id, name="Producto Actualizado")
        updated_product = next(p for p in get_all_products() if p['id'] == product_id)
        self.assertEqual(updated_product['name'], "Producto Actualizado")

    def test_delete_product(self):
        product_id = self.initial_products[0]['id']
        delete_product(product_id)
        self.assertEqual(len(get_all_products()), len(self.initial_products) - 1)

if __name__ == '__main__':
    unittest.main()
```

---

### 4. Documentación (`README.md`)

```markdown
# API REST de Gestión de Inventario

## Descripción
Esta API permite gestionar productos, categorías, usuarios, movimientos de inventario y generar reportes.

## Instalación
1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecuta la aplicación:
   ```bash
   python app.py
   ```

## Endpoints
- **Productos**:
  - `GET /api/products`: Obtener todos los productos.
  - `POST /api/products`: Crear un nuevo producto.
  - `PUT /api/products/:id`: Actualizar un producto.
  - `DELETE /api/products/:id`: Eliminar un producto.

## Pruebas
Ejecuta las pruebas unitarias:
```bash
python -m unittest discover tests
```
```

---

### 5. Beneficios de esta estructura

1. **Modularidad**: El código está dividido en módulos claros y reutilizables.
2. **Facilidad de mantenimiento**: Cada componente tiene una responsabilidad única.
3. **Escalabilidad**: Es fácil agregar nuevas funcionalidades sin afectar el código existente.
4. **Pruebas automatizadas**: Las pruebas aseguran que el código funcione correctamente.
5. **Documentación**: Facilita el uso y entendimiento del sistema.

¡Con esto, tu API está lista para ser desarrollada siguiendo principios sólidos de ingeniería de software! 😊