const express = require("express");
const multer = require("multer");
const { postPredictHandler, postPredictHistoriesHandler } = require("../server/handler");
const  loadModel  = require("../services/loadModel");
const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); 


module.exports = [
    {
        path: "/predict",
        method: "POST",
        handler: postPredictHandler,
        options:{
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 1000000
            }
        }
    },
    {
        path: "/predict/histories",
        method: "GET",
        handler: postPredictHistoriesHandler,
    },
];