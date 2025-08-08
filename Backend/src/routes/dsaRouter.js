
import express from "express";
import { fetchDsaProblems ,addDsaProblem,deleteDsaProblem,updateDsaProblem,fetchDsaProblemNote,updateDsaProblemNote } from "../controllers/dsaController.js";

const dsaRouter = express.Router();
dsaRouter.get('/fetch', fetchDsaProblems);
dsaRouter.post("/add",addDsaProblem)
dsaRouter.patch("/update/note/:id",updateDsaProblemNote);
dsaRouter.get("/fetch/note/:id",fetchDsaProblemNote);
dsaRouter.delete("/delete/:id", deleteDsaProblem );
dsaRouter.post("/update/:id",updateDsaProblem )


export default dsaRouter;






