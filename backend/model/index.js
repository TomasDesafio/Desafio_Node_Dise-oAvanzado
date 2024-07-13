import pool from "../config/index.js";
import format from "pg-format";

try {
  await pool.query("SELECT NOW()");
  console.log("Database connection successful");
} catch (error) {
  console.error("Database connection error:", error);
}

export const getData = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM inventario");

    return rows;
  } catch (error) {
    return error.message;
  }
};

export const insertData = async (post) => {
  const { titulo, img, descripcion } = post;

  try {
    const query = `INSERT INTO inventario(titulo, img, descripcion,likes) VALUES($1, $2, $3,$4)`;
    const values = [titulo, img, descripcion, 0];
    const res = await pool.query(query, values);
    console.log(res);
    console.log("[RESPUESTA DB]: ", res.rows);
    if (res.rowCount > 0) return "Imagen agregadada correctamente";
  } catch (error) {
    console.log("[EROR]: ", error.message);
    return error.message;
  }
};

export const editPost = async (id) => {
  try {
    const query =
      "UPDATE inventario SET likes = likes + 1 WHERE id = $1 RETURNING *";
    const values = [id];
    const response = await pool.query(query, values);
    if (response.rowCount > 0) {
      return response.rows;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id) => {
  try {
    const query = "DELETE FROM inventario WHERE id = $1 RETURNING *";
    const values = [id];
    const response = await pool.query(query, values);
    if (response.rowCount > 0) {
      return response.rows;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getProductsLimit = async ({
  limits = 10,
  order_by = "id_asc",
  page = 1,
}) => {
  const [campo, orden] = order_by.split("_");
  const offset = Math.abs((page - 1) * limits);

  const query = format(
    "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    campo,
    orden,
    limits,
    offset
  );

  try {
    const response = await pool.query(query);
    if (response.rowCount > 0) {
      return response.rows;
    }
  } catch (error) {
    console.log(error);
  }
};

export const obtenerJoyasPorFiltros = async ( queryStrings ) => {
  let filtros = [];
  const values = [];
  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };
  
  let precio_max=queryStrings.precio_max;
  let precio_min=queryStrings.precio_min;
  let categoria=queryStrings.categoria;
  let metal=queryStrings.metal;
  console.log(precio_max,precio_min,categoria,metal)

  if (precio_max) agregarFiltro("precio", "<=", precio_max);
  if (precio_min) agregarFiltro("precio", ">=", precio_min);
  if (categoria) agregarFiltro("categoria", "=", categoria);
  if (metal) agregarFiltro("metal", "=", metal);

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
    console.log(filtros)
  }
  console.log(filtros);
  console.log(consulta);
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
};
