const { postPredictHandler, postPredictHistoriesHandler } = require('../server/handler');
const express = require("express");

const router = express.Router();
router.get("/predict/histories", postPredictHistoriesHandler);
router.post("/predict", postPredictHandler);

module.exports = router;
