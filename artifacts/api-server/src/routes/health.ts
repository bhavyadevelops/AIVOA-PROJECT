const { Router } = require("express");
const { HealthCheckResponse } = require("@workspace/api-zod");

const router = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

module.exports = router;