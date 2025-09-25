# Desafío OlaClick — Backend (NestJS)

Descripción
--------------
API REST para gestionar órdenes de un restaurante. Implementada en **Node.js + TypeScript** con **NestJS**, **Sequelize (Postgres)**, **Redis** y **Docker / docker-compose**.

---

## Contenido del README
1. Quick start
2. Ejecutar local
3. Variables de entorno
4. Endpoints
5. Cómo probar 
6. Tests 
7. Consideraciones técnicas
8. Comportamiento del cache
9. Preguntas adicionales

---

## 1) Quick start
### Requisitos
- Docker
- Docker-Compose

### Pasos
1. Clonar el repo:
```bash
git clone https://github.com/agusrod9/challenge-nodejs-2025.git
cd challenge-nodejs-2025
```
2. Copiar el archivo de ejemplo de variables de entorno y editar valores con los enviados por mail:
```bash
cp .env.example .env
```
3. Levantar con docker-compose:
```bash
docker-compose up --build
```
4. La API quedará expuesta en `http://localhost:<3000> desde Docker`

> Observación: `docker-compose` levanta 3 servicios: `orders_api`, `order_db` y `order_redis`. 

---

## 2) Ejecutar local
1. Instalar dependencias:
```bash
npm install
```
2. Copiar el archivo de ejemplo de variables de entorno y editar valores con los enviados por mail:
```bash
cp .env.example .env
```
3. Ejecutar:
```bash
npm run start
```

---

## 3) Variables de entorno
Fueron enviadas por mail, se deja env.example como guía.

---

## 4) Endpoints (principales)


### GET /orders
Lista todas las órdenes (incluye `items`) con estado distinto de `delivered`.
- Cacheado en Redis por **30 segundos**.

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:3000/orders"
```

---

### GET /orders/:id
Devuelve los detalles de una orden (incluye `items`).

```bash
curl -X GET "http://localhost:3000/orders/1"
```

---

### POST /orders
Crea una nueva orden en estado `initiated`.

**Payload**:
```json
{
  "clientName": "Ana López",
  "items": [
    { "description": "Ceviche", "quantity": 2, "unitPrice": 50 },
    { "description": "Chicha morada", "quantity": 1, "unitPrice": 10 }
  ]
}
```

**Ejemplo cURL**:
```bash
curl -X POST "http://localhost:3000/orders" \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Ana López","items":[{"description":"Ceviche","quantity":2,"unitPrice":50}] }'
```

> Validaciones: `CreateOrderDto` valida `clientName` y cada `item` mediante `class-validator`.

---

### POST /orders/:id/advance
Avanza el estado de la orden: `initiated` → `sent` → `delivered`.
- Si al avanzar llega a `delivered`, la orden se **elimina de la tabla Orders y del cache**.
- También incluí **la tabla DeliveredOrders** a modo de mantener un histórico de ordenes entregadas.
- Al eliminarse de **Orders** se persiste en **DeliveredOrders** junto con sus **OrderItems** correspondientes en **DeliveredOrderItems** para persistir esos items independientemente del mantenimiento de la tabla **OrderItems**.

```bash
curl -X POST "http://localhost:3000/orders/1/advance"
```

---

## 5) Cómo probar
- **Postman**: Descargar proyecto Postman --> [`Desafio-OlaClick.postman_collection.json`](src/docs/Desafio-OlaClick.postman_collection.json) 

---

## 6) Tests
- Ejecutar test unitario sobre **OrdersController**:
```bash
npm run test
```

> Ejecuta 
```bash 
jest src/orders/orders.controller.spec.ts
```
---

## 7) Consideraciones técnicas
- **Arquitectura**: NestJS modular, controllers, services y entidades. Sigue principios SOLID y separación de responsabilidades.
- **DB**: PostgreSQL con Sequelize. En desarrollo se usa `synchronize: true` para facilitar las pruebas.
- **Cache**: Redis para cachear `GET /orders` y `GET /orders/:id` por 30s y reducir las invocaciones a la API.
- **Validación**: DTOs con `class-validator` + `ValidationPipe` global para prevenir requests inválidos.
- **Manejo de errores**: excepciones controladas con filtros.
- **Contenerización**: `Dockerfile` para la API + `docker-compose` para integrar API, Postgres y Redis.

---

## 8) Comportamiento del cache
- `GET /orders` y `GET /orders/:id` consultan primero Redis. Si hay dato, lo devuelven. Si no, van a la DB y luego setean la clave con TTL 30 segundos.
- Cuando una orden llega a `delivered` se elimina de la DB, persistiéndola en tabla **DeliveredOrders** y también se asegura la limpieza del cache.

---

## 9) Preguntas adicionales
- ¿Cómo desacoplarías la lógica de negocio del framework NestJS?

    **Yo separaría principalmente la lógica de negocio en servicios puros, podría llamarlos desde los controllers de Nest y de esta forma seguiría funcionando como hasta ahora, pero si quisiera cambiar de framework por ejemplo, podría utilizar los mismos servicios desde el nuevo y obtendría el mismo comportamiento.**
    
- ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?

    **Yo correría varias instancias en contenedores y utilizaría por ejemplo Kubernetes para balancear la carga. Con Redis ya estaría "ahorrando" algunas llamadas a la base. La base se podría indexar y replicar con un pool de conexiones. Y la API al impactar todo en Redis o la base, podría tener muchas instancias atendiendo clientes indistintamente sin afectar los datos.**

- ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?

    **Lo que me pareció útil de Redis es que puedo aumentar velocidad de respuesta a la vez que disminuyo invocaciones a la base, no lo había utilizado antes y la verdad me pareció muy útil para algunas cosas que no son tan volátiles y puedo mantenerlas un tiempo prudencial en memoria del Server. Alternativas no conozco y de lo que pude averiguar la verdad Redis me parece lo mejor para este caso ya que por ejemplo me permite persistir estructuras complejas como un Array de Orders como ejemplo.**

---

## Contacto
Enviarme un [E-Mail](mailto:agusrod9@gmail.com).