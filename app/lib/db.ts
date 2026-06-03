import { openDB } from "idb";

const DB_NAME = "inventario-db";
const STORE = "productos";

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, {
        keyPath: "id",
      });
    }
  },
});

// Guardar productos
export async function saveProductos(productos: any[]) {
  const db = await dbPromise;
  const tx = db.transaction(STORE, "readwrite");

  for (const producto of productos) {
    await tx.store.put(producto);
  }

  await tx.done;
}

// Obtener productos offline
export async function getProductos() {
  const db = await dbPromise;
  return await db.getAll(STORE);
}