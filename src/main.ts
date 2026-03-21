import Fastify from "fastify"

import { createProduct, getProducts, updateProduct, getProductsById, deleteProduct } from "./products.ts";

const server = Fastify({logger: true});

server.get('/', async function (request, reply) {
  return "1234567890qwertyuiop[]asdfghjkl;'xcvbnm,./";
});

server.get('/api/products', getProducts);

server.get("/api/products/:productId", getProductsById);

server.post("/api/products", createProduct);

server.put("/api/products/:productId", updateProduct);

server.delete("/api/products/:productId", deleteProduct);
try{
    await server.listen({ port: 3456 });
} catch (err){
    server.log.error(err);
}