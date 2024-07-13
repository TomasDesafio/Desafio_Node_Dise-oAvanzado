import { Router } from 'express'

import express from 'express'
import { getDatacontrollers, insertDatacontrollers,editPostcontrollers,deletePostcontrollers,notFound,home,getProductsLimits,getProductsFilter } from '../controllers/index.js'

const router = express.Router()


router.get("/", home);
router.get('/joyas',getProductsLimits)
router.get('/joyas/filtros',getProductsFilter)



router.get("*", notFound);



export default router