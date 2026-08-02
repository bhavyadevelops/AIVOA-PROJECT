import { Router } from "express";
import extractRouter from "./extract";
import createRouter from "./create";
import chatRouter from "./chat";
import getRouter from "./get";

const router = Router();

router.use(extractRouter);
router.use(createRouter);
router.use(chatRouter);
router.use(getRouter);

export default router;