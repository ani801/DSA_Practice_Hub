import express from 'express'; 
import { yearlyPotdController,addPotd ,getPOTD} from '../controllers/potdController.js'; 

const potdRouter = express.Router();
potdRouter.get("/yearly/:year", yearlyPotdController);
potdRouter.post("/add/:year_month_day", addPotd);
potdRouter.get("/dailypotd", getPOTD);


export default potdRouter;