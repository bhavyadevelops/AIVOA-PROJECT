const { Router } = require("express");
const healthRouter = require("./health");
const complaintsRouter = require("./complaints");

const router = Router();

router.use(healthRouter);
router.use(complaintsRouter);

module.exports = router;