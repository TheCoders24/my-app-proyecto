// app/api/productos/route.js
import { NextResponse } from 'next/server';

let productos = []; // Esto es solo un ejemplo, usa una base de datos en un entorno real

export async function GET() {
  return NextResponse.json(productos);
}

export async function POST(request) {
  const nuevoProducto = await request.json();
  productos.push({ id: productos.length + 1, ...nuevoProducto });
  return NextResponse.json(nuevoProducto, { status: 201 });
}

export async function PUT(request) {
  const { id, ...datosActualizados } = await request.json();
  const index = productos.findIndex((p) => p.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...datosActualizados };
    return NextResponse.json(productos[index]);
  }
  return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  productos = productos.filter((p) => p.id !== id);
  return NextResponse.json({ success: true });
}