alert("Bienvenido a la zapatería Montero");

const IVA = 0.19;
const DESCUENTO_UMBRAL = 1000000;     
const DESCUENTO_PORCENTAJE = 0.10;

// Formatear moneda
const formatearMoneda = (valor) => "COP " + valor.toLocaleString("es-CO");

// Catálogo
const catalogo = [
  { id: 1, marca: "Nike",    modelo:"Air Zoom",      precio: 350000, tallas: [38, 39, 40, 41, 42, 43], stock: 12 },
  { id: 2, marca: "Nike",    modelo:"Court Legacy",  precio: 330000, tallas: [38, 39, 40, 41, 42],     stock: 8  },
  { id: 3, marca: "Adidas",  modelo:"Ultraboost",    precio: 440000, tallas: [38, 39, 40, 41, 43],     stock: 10 },
  { id: 4, marca: "Adidas",  modelo:"Gazelle",       precio: 260000, tallas: [36, 37, 38, 40, 41],     stock: 6  },
  { id: 5, marca: "Puma",    modelo:"RS-X",          precio: 320000, tallas: [37, 38, 39, 40, 41, 42], stock: 7  },
  { id: 6, marca: "Puma",    modelo:"Caven",         precio: 300000, tallas: [36, 37, 38, 39, 40],     stock: 9  },
  { id: 7, marca: "Converse",modelo:"Chuck 70",      precio: 350000, tallas: [36, 37, 38, 39, 40],     stock: 11 },
  { id: 8, marca: "Converse",modelo:"Run Star Hike", precio: 370000, tallas: [37, 38, 39, 40, 41],     stock: 5  },
];

// Funciones
const verMarcas = () => {
  const marcas = [];
  for (let i = 0; i < catalogo.length; i++) {
    const m = catalogo[i].marca;
    if (!marcas.includes(m)) marcas.push(m);
  }
  console.clear();
  console.log("Marcas disponibles:");
  for (let j = 0; j < marcas.length; j++) {
    console.log((j + 1) + ". " + marcas[j]);
  }
  return marcas;
};

const elegirMarca = () => {
  const marcas = verMarcas();
  let mensaje = "Elige la MARCA (escribe el número):\n";
  for (let i = 0; i < marcas.length; i++) {
    mensaje += (i + 1) + ". " + marcas[i] + "\n";
  }
  let entrada = prompt(mensaje);
  if (entrada === null) return null;
  let idx = Number(entrada) - 1;
  if (isNaN(idx) || idx < 0 || idx >= marcas.length) {
    alert("Opción inválida. Intenta de nuevo.");
    return elegirMarca();
  }
  return marcas[idx];
};

const verProductosPorMarca = (marca) => {
  const lista = [];
  for (let i = 0; i < catalogo.length; i++) {
    if (catalogo[i].marca.toLowerCase() === marca.toLowerCase()) {
      lista.push(catalogo[i]);
    }
  }
  console.log("Productos de " + marca + ":");
  for (let j = 0; j < lista.length; j++) {
    const p = lista[j];
    console.log(
      p.id + ". " + p.marca + " " + p.modelo + " - " + formatearMoneda(p.precio) +
      " - Tallas: " + p.tallas.join(", ") + " - Stock: " + p.stock
    );
  }
  return lista;
};

const elegirProductoDe = (lista) => {
  let mensaje = "Elige el ID del modelo:\n";
  for (let i = 0; i < lista.length; i++) {
    const p = lista[i];
    mensaje += p.id + ". " + p.modelo + " – " + formatearMoneda(p.precio) +
               " – Tallas: [" + p.tallas.join(", ") + "] – Stock: " + p.stock + "\n";
  }
  let entrada = prompt(mensaje);
  if (entrada === null) return null;
  let id = Number(entrada);
  if (isNaN(id)) {
    alert("ID inválido.");
    return elegirProductoDe(lista);
  }
  let prod = null;
  for (let j = 0; j < lista.length; j++) {
    if (lista[j].id === id) { prod = lista[j]; break; }
  }
  if (prod === null) {
    alert("ID inexistente.");
    return elegirProductoDe(lista);
  }
  return prod;
};

const elegirCantidad = (producto) => {
  let entrada = prompt("¿Cuántos pares de " + producto.modelo + " deseas? (Stock: " + producto.stock + ")");
  if (entrada === null) return null;
  let cantidad = Number(entrada);
  if (isNaN(cantidad) || cantidad <= 0 || cantidad > producto.stock) {
    alert("Cantidad inválida.");
    return elegirCantidad(producto);
  }
  return cantidad;
};

const preguntarSeguir = () => {
  let entrada = prompt("¿Deseas seguir comprando? (si / no)");
  if (entrada === null) return false;
  entrada = entrada.toLowerCase();
  if (entrada === "si" || entrada === "sí") return true;
  if (entrada === "no") return false;
  alert("Por favor escribe 'si' o 'no'.");
  return preguntarSeguir();
};

// Flujo de compra 
let carrito = [];   
let totalCompra = 0;
let seguirComprando = true;

while (seguirComprando) {
  let marcaElegida = elegirMarca();
  if (marcaElegida === null) break;

  let lista = verProductosPorMarca(marcaElegida);
  if (!lista || lista.length === 0) {
    alert("No hay productos para esa marca.");
    continue;
  }

  let productoElegido = elegirProductoDe(lista);
  if (productoElegido === null) break;

  let cantidad = elegirCantidad(productoElegido);
  if (cantidad === null) break;

  if (cantidad > productoElegido.stock) {
    alert("No hay suficiente stock.");
    continue;
  }
  productoElegido.stock = productoElegido.stock - cantidad;

  let subtotal = productoElegido.precio * cantidad;
  totalCompra += subtotal;

  carrito.push({
    marca: productoElegido.marca,
    modelo: productoElegido.modelo,
    precio: productoElegido.precio,
    cantidad: cantidad,
    subtotal: subtotal
  });

  alert(
    "Agregaste " + cantidad + " par(es) de " + productoElegido.modelo +
    "\nSubtotal: " + formatearMoneda(subtotal) +
    "\nTotal acumulado: " + formatearMoneda(totalCompra)
  );

  seguirComprando = preguntarSeguir();
}

// Resumen final 
if (totalCompra > 0) {
  let descuento = 0;
  if (totalCompra >= DESCUENTO_UMBRAL) {
    descuento = totalCompra * DESCUENTO_PORCENTAJE;
    alert(
      "¡Felicidades! Has obtenido un BONO del 10% de descuento por compras superiores a " +
      formatearMoneda(DESCUENTO_UMBRAL)
    );
  }

  let base = totalCompra - descuento;
  let iva = Math.round(base * IVA);        
  let totalfinal = base + iva;

  // Resumen
  alert(
    "Resumen de tu compra:\n" +
    "Subtotal: " + formatearMoneda(totalCompra) + "\n" +
    "Descuento: -" + formatearMoneda(descuento) + "\n" +
    "IVA: " + formatearMoneda(iva) + "\n" +
    "TOTAL A PAGAR: " + formatearMoneda(totalfinal) + "\n\n" +
    "✅ ¡Gracias por tu compra en Zapatería Montero! 🎉"
  );

  // Inventario comprado en consola
  console.log("===== RESUMEN DE COMPRA =====");
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    console.log(
      item.marca + " " + item.modelo +
      " | Cantidad: " + item.cantidad +
      " | Precio unitario: " + formatearMoneda(item.precio) +
      " | Subtotal: " + formatearMoneda(item.subtotal)
    );
  }
  console.log("DESCUENTO APLICADO:", formatearMoneda(descuento));
  console.log("IVA:", formatearMoneda(iva));
  console.log("TOTAL FINAL PAGADO:", formatearMoneda(totalfinal));
  console.log("===== ✅ FIN DE LA COMPRA =====");

} else {
  alert("No realizaste ninguna compra. ¡Gracias por visitarnos!");
  console.log("El cliente no realizó ninguna compra.");
}
