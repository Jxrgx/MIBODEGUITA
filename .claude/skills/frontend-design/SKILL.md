---
name: frontend-design
description: Reglas de diseño UI/UX para la tienda de abarrotes MiBodeguita (React 19 + Tailwind CSS v4). Úsala antes de crear o modificar cualquier pantalla, componente, estilo o flujo de compra: tarjetas de producto, carrito, checkout, modales, navegación, Inicio, colores, espaciado, responsive/mobile-first o accesibilidad. También aplica al revisar código de UI o al decidir si agregar una función de marketing (cupones, puntos, promociones).
---

# Diseño UI/UX — MiBodeguita

Tienda de abarrotes en línea: el cliente arma su despensa desde el celular y confirma el pedido por WhatsApp. Cada decisión de diseño se mide con una pregunta: **¿ayuda a encontrar, agregar y pedir productos más rápido y con confianza?**

Principios, en orden de prioridad:

1. **Mobile-first.** La mayoría compra desde el celular, con una mano y a veces con mala señal.
2. **Claridad sobre decoración.** Precio, nombre y botón de agregar siempre visibles; nada compite con ellos.
3. **Fresh/Clean.** Fondos claros, mucho aire, color solo donde guía una acción.
4. **Honestidad.** Sin descuentos inventados, urgencia falsa ni mecánicas de lealtad (ver "Fuera de alcance").

---

## 1. Base técnica (obligatoria)

| Qué | Dónde | Regla |
|---|---|---|
| Tokens de diseño | `src/styles/theme.css` (`@theme static`) | Única fuente de colores, radios, sombras y animaciones. Si falta un valor, agrégalo aquí, no en el componente. |
| Componentes base | `src/components/ui/` (importa desde `./ui`) | Usa `Button`, `IconButton`, `Card`, `Input`, `Badge`, `Chip`, `Modal`, `PriceSummary`, `ProductImage`, `EmptyState`, `Skeleton`, `SectionHeader` antes de escribir markup propio. |
| Clases condicionales | `cn()` de `src/lib/cn.js` | Usa siempre `cn()` (incluye tailwind-merge): así la clase que llega por `className` gana sobre la del componente. |
| Precios | `formatMoney()` de `src/lib/format.js` | Nunca `$${x.toFixed(2)}`. Para descuentos usa `getDiscountPercent(product)`. |
| Pedidos | `src/lib/orders.js` | `formatOrderDate`, `orderStatus`, `paymentLabel`, `deliveryLabel`. |
| Íconos | `lucide-react` | Siempre `aria-hidden="true"` si son decorativos. Sin emojis como íconos de UI. |

### Reglas de CSS

- **Nada de `style={{}}`** salvo valores realmente dinámicos (posición calculada, `transform` de un carrusel, color de categoría que viene de Firestore).
- **Sin hex sueltos** en componentes (`#666`, `#eee`…). Usa tokens: `text-muted`, `border-border`, `bg-gray-50`.
- **Todo CSS global va en una capa** (`@layer base`/`components`). El CSS sin capa le gana a las utilidades de Tailwind sin importar la especificidad (por eso, en su momento, `* { padding: 0 }` anuló todo el espaciado).
- **No uses `overflow-x: hidden` en `html`/`body`**: rompe `position: sticky`. Usa `overflow-x: clip`.
- **Las animaciones de entrada terminan en `transform: none`**, no en `translateY(0)`: un `transform` persistente rompe los `position: fixed` internos.
- **Los modales se renderizan con portal** (`Modal` ya lo hace). Nunca pongas un `fixed` dentro de un contenedor animado.
- **Preflight está activo**: los `button`, `h1`–`h6`, `ul` e `img` no traen estilo propio. Dales tamaño, peso y color de forma explícita.

---

## 2. Mobile-first

Escribe primero las clases para 360 px y **agrega** comportamiento con prefijos (`sm:`, `md:`, `lg:`). Nunca diseñes para escritorio y luego "arregles" el móvil.

| Ancho | Breakpoint | Layout |
|---|---|---|
| < 640 px | base | 1 columna; productos en `grid-cols-2`; navegación en `BottomNav` |
| ≥ 640 px | `sm:` | Productos en 3 columnas; los modales `sheet` se centran |
| ≥ 768 px | `md:` | La navegación pasa al header; se oculta `BottomNav` (`md:hidden`) |
| ≥ 1024 px | `lg:` | Productos en 5 columnas; carrito como panel lateral |

**Reglas:**

- **Contenedor de página:** `mx-auto w-full max-w-6xl px-4`. Nada se estira a todo el ancho de un monitor.
- **Áreas táctiles de al menos 44×44 px** (`min-h-11`, `size-11`). Los `IconButton` ya cumplen; no los achiques por debajo de `size-9` y solo dentro de un control agrupado (como el selector de cantidad).
- **Separación entre botones táctiles adyacentes:** al menos `gap-2`.
- **Inputs a 16 px** (`text-base`): con menos, iOS hace zoom al enfocar.
- **Zona del pulgar:** la acción principal de cada pantalla va abajo (pie fijo del modal, botón final del carrito), nunca arriba a la derecha.
- **Áreas seguras:** cualquier elemento fijo abajo lleva `pb-[env(safe-area-inset-bottom)]`.
- **Carruseles horizontales:** `hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4`. El `-mx-4 px-4` deja que el contenido llegue al borde de la pantalla sin perder el margen visual.
- **Espacio para la barra inferior:** el `<main>` lleva `pb-28 md:pb-10`. No vuelvas a calcular rellenos fijos para el header (es `sticky`).

---

## 3. Paleta Fresh/Clean

Mucho blanco y gris claro, azul de marca para navegar, amarillo solo para la acción de compra y rojo solo para ofertas. **Regla 70/20/10:** 70 % superficies neutras, 20 % azul de marca, 10 % acentos (amarillo, rojo, verde).

| Rol | Token / clase | Uso | Nunca |
|---|---|---|---|
| Fondo de la app | `bg-background` (#f5f5f5) | Fondo general | Fondos de color en secciones enteras |
| Superficie | `bg-surface` (#fff) + `shadow-sm` | Tarjetas, modales, header de secciones | Sombras fuertes en tarjetas en reposo |
| Marca | `bg-primary` / `text-primary` (#004aad) | Header, precios, botón "Agregar", pestaña activa | Texto largo en azul |
| Marca suave | `bg-primary-soft` | Fondos de íconos, opción seleccionada, hover de botones ghost | — |
| Compra | `bg-secondary` (#ffd700) + `text-ink` | **Solo** la acción que avanza el pedido: "Realizar pedido", "Confirmar pedido" | Texto amarillo sobre blanco (no se lee); más de un botón amarillo por pantalla |
| Oferta | `text-accent` / `Badge tone="sale"` (#d32f2f) | Porcentaje de descuento, precio rebajado, aviso de ahorro | Errores (usa `danger`) ni decoración |
| Fresco / éxito | `text-success` / `bg-success-soft` (#2e7d32) | Confirmaciones, "agregado", WhatsApp, Frutas y Verduras | — |
| Aviso | `text-warning` / `bg-warning-soft` | Notas del cliente, estados pendientes | — |
| Error | `text-danger` / `bg-danger-soft` | Errores, eliminar | — |
| Texto | `text-ink` → `text-muted` → `text-subtle` | Títulos → texto normal → texto secundario | Grises más claros que `text-subtle` sobre blanco (no pasan AA) |
| Bordes | `border-border` (#e5e7eb) | Separadores, inputs, tarjetas planas | Bordes oscuros |

**Contraste:** todo texto debe pasar **WCAG AA (4.5:1)**; los textos grandes y en negritas, 3:1. Texto blanco solo sobre `primary`, `accent`, `success`, `danger` o sobre fotos con degradado `from-black/70`.

---

## 4. Tipografía y espaciado

- **Escala:** `text-xs` (etiquetas) · `text-sm` (secundario) · `text-base` (cuerpo, inputs) · `text-lg` (título de sección) · `text-xl` (precio en tarjeta) · `text-2xl` (título de pantalla). No mezcles tamaños arbitrarios (`text-[13px]`) salvo `text-[0.95rem]` para nombres de producto.
- **Pesos:** `font-semibold` para nombres y botones; `font-bold`/`font-extrabold` solo para títulos y precios.
- **Títulos:** uno por pantalla con `h1`; secciones con `SectionHeader` (`h2`). Sin emojis en títulos.
- **Espaciado:** múltiplos de 4 px. Dentro de tarjetas `p-3`/`p-4`; entre secciones `mb-6`; entre tarjetas `gap-3`.
- **Radios:** tarjetas `rounded-lg`, botones de acción `rounded-pill`, botones dentro de tarjetas `rounded-md`, inputs `rounded-sm`.

---

## 5. Tarjeta de producto

Referencia: `src/components/ProductCard.jsx`. Toda vista que muestre productos en lista o cuadrícula usa este componente; no crees variantes paralelas. **Las cuadrículas usan `ProductGrid`** (`src/components/ProductGrid.jsx`), que ya trae columnas, skeletons de carga y estado vacío (`emptyState`); no copies las clases de la cuadrícula.

**Anatomía (de arriba abajo):**

1. **Imagen** con `ProductImage` dentro de un contenedor **cuadrado** (`aspect-square rounded-md bg-gray-50 p-3`, imagen con `mix-blend-multiply` para fundir fondos blancos). `loading="lazy"` salvo las primeras 4 (`priority`). Si la imagen falla, muestra la canasta gris; nunca el ícono roto.
2. **Favorito** arriba a la izquierda: `size-10`, `aria-pressed`, `aria-label` con el nombre del producto.
3. **Descuento** arriba a la derecha: `Badge tone="sale"` con `-N%`, **solo si `originalPrice > price`**.
4. **Nombre** con `line-clamp-2`, `font-semibold`.
5. **Precio por unidad** (`unitPrice`) en `text-xs text-subtle`, si existe.
6. **Precio:** tachado (`line-through text-subtle`) si hay descuento real, y debajo el precio actual en `text-xl font-extrabold text-primary`.
7. **Botón "Agregar"**: ancho completo, `min-h-11`, `bg-primary text-white`, ícono `Plus` y `aria-label="Agregar {nombre} al carrito"`. **Cuando el producto ya está en el carrito, se convierte en el selector `− n +`** del mismo tamaño y color, conectado a `useCart()` (`findCartLineIndex` de `src/lib/cart.js`). En 1, el botón izquierdo muestra un bote y quita el producto. El foco pasa al control nuevo cuando se usa el teclado.

**Reglas:**

- **El botón de agregar es la acción principal de la tarjeta**: siempre visible, sin hover para descubrirlo y siempre en la misma posición (`mt-auto`) para que las filas queden alineadas.
- **Imagen y nombre forman un `<button>` que abre el detalle**; favorito y agregar son botones hermanos. Nunca anides botones ni pongas `onClick` en un `div`.
- **Productos a granel** (`isBulkProduct()` de `src/lib/cart.js`): el botón siempre dice "Agregar" y abre `BulkProductModal` para elegir peso o piezas; nunca muestran el selector `− n +`. Tampoco muestres el aviso "Agregado" al abrir el modal: todavía no se agregó nada.
- **Radios:** la tarjeta usa `rounded-lg`. Si se quieren esquinas más suaves, cambia `--radius-lg` en `theme.css`; no uses `rounded-2xl` (con nuestra escala mide lo mismo y deja la escala desordenada).
- **Feedback al agregar:** toast breve ("Agregado: …") y el contador del carrito con `cart-shake`. Sin confeti ni sonidos.
- **Cuadrícula:** `grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`.

### Selector de cantidad

- El control es `− [n] +` dentro de un contenedor `rounded-pill border`.
- `−` se desactiva en 1 (para eliminar está el ícono de bote de basura).
- El número lleva `aria-live="polite"`.
- Los botones llevan `aria-label` con el nombre del producto.

---

## 6. Carrito lateral deslizable

> Implementado en `src/components/cart/`: `CartContents` (contenido compartido), `CheckoutBar` (total y "Realizar pedido"), `CartDrawer` (panel de escritorio) y `CartView.jsx` (página `/cart`). Cualquier cambio del carrito se hace en `CartContents`/`CheckoutBar` para que ambos sigan iguales. App pasa a los dos el mismo objeto `cartContentProps`.
>
> En la página `/cart`, `CheckoutBar` es `sticky` sobre la barra inferior usando el token `--spacing-nav` de `theme.css` (alto de `BottomNav`); no calcules esa altura a mano.

**Comportamiento por tamaño:**

| Ancho | Presentación |
|---|---|
| < 768 px | La pestaña "Carrito" de `BottomNav` sigue llevando a `/cart` (pantalla completa). Opcional: barra flotante "Ver carrito · N · $total" sobre `BottomNav` cuando hay productos. |
| ≥ 768 px | El botón "Carrito" del header abre un **panel lateral derecho** (drawer) sin salir de la página. |

**Especificación del drawer:**

- Agrega a `Modal` una variante `variant="drawer"`; no crees otro sistema de modales. Así hereda el portal, Escape, el clic en el fondo, el bloqueo de scroll y el regreso del foco.
- **Panel:** `fixed inset-y-0 right-0 w-full max-w-md bg-surface shadow-lg`, alto completo y con scroll interno.
- **Animación:** entra desde la derecha con `translateX(100%) → none` en unos 300 ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Define el keyframe en `theme.css` como `--animate-drawer-in` y respeta `motion-reduce`.
- **Fondo:** `bg-black/50` con `animate-overlay-in`; al tocarlo se cierra.
- **Estructura:**
  1. **Encabezado fijo:** "Tu carrito", el número de artículos y un `IconButton` X con `label="Cerrar carrito"`.
  2. **Cuerpo con scroll:** lista de `CartItem` y, si está vacío, `EmptyState` con "Ir a comprar".
  3. **Pie fijo:** aviso de ahorro (si hay), `PriceSummary` (Subtotal, Envío "Por confirmar", Total) y el botón amarillo `Button size="lg" fullWidth` "Realizar pedido", que abre `CheckoutModal`.
- **Accesibilidad:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apuntando al título; el foco va al panel al abrir y regresa al botón del carrito al cerrar.
- **No abras el drawer solo** cada vez que se agrega un producto: interrumpe la compra. Basta con el toast y la animación del contador.
- **Estado:** todo viene de `useCart()`; el drawer no duplica cálculos de totales.

---

## 7. Modales, checkout y feedback

- **Bottom sheet en móvil** (`Modal variant="sheet"`) para producto, granel, checkout y detalle de pedido; **diálogo centrado** para confirmaciones breves.
- **La acción principal va en `footer`**: queda fija y siempre visible.
- **Checkout:** opciones de entrega con radios reales (`sr-only` dentro de un `label`), un mensaje claro de que el pedido se confirma por WhatsApp y `PriceSummary`. **El envío se muestra "Por confirmar"**: depende del destino; no inventes una tarifa.
- **Pedido enviado:** siempre ofrece un enlace "Abrir WhatsApp de nuevo" (el navegador puede bloquear la pestaña nueva).
- **Toasts:** `role="status"` (`alert` para errores), un mensaje a la vez y unos 2–3 segundos. No encadenes varios toasts por una sola acción.
- **Carga:** `Skeleton`/`ProductSkeleton` con la forma final del contenido; spinner solo para la pantalla completa.
- **Vacíos:** `EmptyState` con ícono, título, mensaje útil y una acción. Si una sección del Inicio no tiene contenido, **ocúltala**; no muestres "no disponible".

---

## 8. Accesibilidad (mínimos)

- Todo lo que se puede tocar es un `<button>` o un `<a>`, nunca un `div` con `onClick`.
- Todo `IconButton` lleva `label`. Las imágenes decorativas llevan `alt=""`; las que dan información, un `alt` descriptivo.
- Foco visible: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary` (los componentes de `ui/` ya lo traen).
- Estados con atributos ARIA: `aria-pressed` (favorito, chips), `aria-current="page"` (navegación), `aria-checked` (opciones), `aria-busy` (carga).
- Los carruseles automáticos se pausan con hover/focus, tienen botón de pausa y respetan `prefers-reduced-motion`.
- La información no depende solo del color: los estados llevan texto ("Pendiente", "-20%").

---

## 9. Fuera de alcance: puntos, cupones y patrones engañosos

La tienda **eliminó a propósito** los cupones, los puntos de fidelidad y "Rasca y gana". No los reintroduzcas, ni siquiera de forma parcial:

- Nada de campos `wallet`, `coupons`, `pointsUsed`, `bonusPoints` ni `rewardProducts` en componentes, contextos o servicios.
- Nada de inputs de código promocional, sliders de puntos, insignias "+N puntos", pestañas "Puntos" ni colecciones `coupons`/`reward_products`.
- Los descuentos existen **solo como precio del producto** (`price` < `originalPrice` real, cargado por el admin) o como precio de combo.

Tampoco se permiten patrones que engañen al cliente:

- **Precio anterior inventado** (por ejemplo `price * 1.2` cuando falta `originalPrice`).
- **Escasez falsa**: barras de "quedan pocas unidades" sin inventario real.
- **Contadores de cuenta regresiva** para presionar la compra, salvo que la oferta termine de verdad a esa hora y se pueda verificar.
- **Datos de relleno visibles** para el cliente: teléfonos o direcciones de ejemplo, funciones simuladas (como el escáner de código de barras actual).

Si una solicitud pide algo de esta lista, señálalo y propone una alternativa honesta (ofertas reales, combos, "Más vendidos").

---

## 10. Checklist antes de terminar un cambio de UI

- [ ] Se ve bien a 360 px y no se estira a más de `max-w-6xl` en escritorio.
- [ ] Usa componentes de `ui/`, tokens de `theme.css` y `cn()`; no hay hex ni `style={{}}` estáticos.
- [ ] Los botones táctiles miden al menos 44 px y la acción principal está al alcance del pulgar.
- [ ] Los precios usan `formatMoney` y los descuentos se basan en datos reales.
- [ ] Hay estados de carga, vacío y error.
- [ ] Funciona con teclado; los `IconButton` tienen `label` y el foco es visible.
- [ ] No aparece nada de puntos, cupones, urgencia falsa ni datos de relleno.
- [ ] `npm run build` pasa y `npx eslint` no agrega errores nuevos en los archivos tocados.
