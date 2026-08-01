import { Router, type IRouter } from "express";
import extractRouter from "./extract";
import createRouter from "./create";
import chatRouter from "./chat";
import getRouter from "./get";

const router: IRouter = Router();

router.use(extractRouter);
router.use(createRouter);
router.use(chatRouter);
router.use(getRouter);

export default router;
