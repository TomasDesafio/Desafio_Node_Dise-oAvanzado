import {
  getData,
  insertData,
  editPost,
  deletePost,
  getProductsLimit,
  obtenerJoyasPorFiltros,
} from "../model/index.js";

export const notFound = (req, res) => {
  res.status(404).send("Not found");
};

export const home = (req, res) => {
  res.send("Hello World desde controller");
};

export const getDatacontrollers = async (req, res) => {
  try {
    const result = await getData();
    res.json({ result });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const insertDatacontrollers = async (req, res) => {
  const post = {
    titulo: req.body.titulo,
    img: req.body.img,
    descripcion: req.body.descripcion,
  };

  try {
    if (
      post.titulo === undefined ||
      post.img === undefined ||
      post.descripcion === undefined
    )
      return res.status(400).json({ message: "Datos incorrectos" });
    const response = await insertData(post);
    res.json({ data: response });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const editPostcontrollers = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await editPost(id);
    res.status(200).send("Product edited");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deletePostcontrollers = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await deletePost(id);
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const prepararHATEOAS = (response) => {
  const results = response
    .map((m) => {
      return {
        name: m.nombre,
        href: `/joyas/joya/${m.id}`,
      };
    })
    .slice(0, 6);
  const total = response.length;
  const HATEOAS = {
    total,
    results,
  };
  return HATEOAS;
};

export const getProductsLimits = async (req, res) => {
  try {
    const { limits, order_by, page } = req.query;
    const response = await getProductsLimit({ limits, order_by, page });
    const HATEOAS = await prepararHATEOAS(response);

    res.status(200).send(HATEOAS);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getProductsFilter = async (req, res) => {
  try {
   
    const queryStrings = req.query;
    console.log(queryStrings)
    const response = await obtenerJoyasPorFiltros(queryStrings);
    //const HATEOAS = await prepararHATEOAS(response);

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
