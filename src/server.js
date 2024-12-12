const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const allergyRoutes = require("./routes/allergyRoutes");
const predictRoutes = require("./routes/predictRoutes");
const loadModel = require("./services/loadModel");
const Hapi = require('@hapi/hapi');
const InputError = require("./exceptions/InputError")

dotenv.config();

const app = express();
PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

// // Rute root
// app.get("/", (req, res) => {
//     res.send("Welcome to the API! Use /api/auth for authentication.");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/allergy", allergyRoutes);
// app.use("/api/predict", predictRoutes);

// // Jalankan server pada host '0.0.0.0'
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });

(async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    const model = await loadModel();
    server.app.model = model;
 
    server.route([...authRoutes, ...userRoutes, ...allergyRoutes, ...predictRoutes]);
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }
 
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }
 
        return h.continue;
    });
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();

