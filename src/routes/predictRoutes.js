const express = require("express");
const multer = require("multer");
const { postPredictHandler, postPredictHistoriesHandler } = require("../server/handler");
const { loadModel } = require("../services/loadModel");
const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); 

const attachModel = async (req, res, next) => {
    if (!req.app.locals.model) {
        req.app.locals.model = await loadModel();
    }
    req.model = req.app.locals.model;
    next();
};

router.get("/predict/histories", postPredictHistoriesHandler);

router.post("/predict", 
    upload.single("image"),
    attachModel,
    (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Image file is required.",
            });
        }
        console.log("File received:", req.file);
        console.log("Payload body:", req.body);
        next();
    }, 
    postPredictHandler
);

module.exports = router;


