const express = require("express");
const multer = require("multer");
const { postPredictHandler, postPredictHistoriesHandler } = require("../server/handler");
const  loadModel  = require("../services/loadModel");
const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); 

// const attachModel = async (req, res, next) => {
//     const model = await loadModel();
//     if (!model) {
//         return res.status(500).json({
//             status: "error",
//             message: "Model not loaded.",
//         });
//     }
//     req.model = model; 
//     next();
// };

// // Routes array
// const routes = [
//     {
//         path: "/predict",
//         method: "post",
//         middlewares: [
//             upload.single("image"), // Middleware untuk file upload
//             attachModel, // Middleware untuk memuat model
//             (req, res, next) => {
//                 if (!req.file) {
//                     return res.status(400).json({
//                         status: "error",
//                         message: "File gambar diperlukan.",
//                     });
//                 }
//                 console.log("File diterima:", req.file);
//                 console.log("Payload body:", req.body);
//                 next();
//             },
//         ],
//         handler: postPredictHandler,
//     },
//     {
//         path: "/predict/histories",
//         method: "get",
//         middlewares: [], // Tidak ada middleware tambahan
//         handler: postPredictHistoriesHandler,
//     },
// ];

// // Register routes dynamically
// routes.forEach((route) => {
//     const { path, method, middlewares, handler } = route;
//     if (middlewares && middlewares.length > 0) {
//         router[method](path, ...middlewares, handler);
//     } else {
//         router[method](path, handler);
//     }
// });

// module.exports = router;



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