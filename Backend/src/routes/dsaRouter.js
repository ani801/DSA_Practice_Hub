
import express from "express";
import { fetchDsaProblems ,addDsaProblem,deleteDsaProblem,updateDsaProblem } from "../controllers/dsaController.js";

const dsaRouter = express.Router();
dsaRouter.get('/fetch', fetchDsaProblems);
dsaRouter.post("/add",addDsaProblem)
dsaRouter.delete("/delete/:id", deleteDsaProblem );
dsaRouter.post("/update/:id",updateDsaProblem )


export default dsaRouter;






