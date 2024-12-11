const Hapi = require('@hapi/hapi');
const dotenv = require("dotenv");
const loadModel = require("./services/loadModel");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const allergyRoutes = require("./routes/allergyRoutes");
const predictRoutes = require("./routes/predictRoutes");
const InputError = require("./exceptions/InputError");

// Load environment variables
dotenv.config();

(async () => {
    // Initialize Hapi server
    const server = Hapi.server({
        port: process.env.PORT || 8000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'], // Allow all origins for CORS
            },
        },
    });

    // Load TensorFlow model
    const model = await loadModel();
    server.app.model = model;

    // Validate and combine all routes
    const validateRoutes = (routes, name) => {
        // Check if routes is an array
        if (!Array.isArray(routes)) {
            console.error(`Routes in ${name} should be an array.`);
            throw new Error(`Invalid route definition in ${name}`);
        }

        // Validate each route
        routes.forEach(route => {
            if (!route.method || !route.path || !route.handler) {
                console.error(`Invalid route in ${name}:`, route);
                throw new Error(`Invalid route definition in ${name}`);
            }
        });
    };

    try {
        console.log("Validating routes...");

        // Validate all routes before registering
        validateRoutes(authRoutes, "authRoutes");
        validateRoutes(userRoutes, "userRoutes");
        validateRoutes(allergyRoutes, "allergyRoutes");
        validateRoutes(predictRoutes, "predictRoutes");

        // Register all routes
        server.route([
            ...authRoutes,  // Routes for authentication
            ...userRoutes,  // Routes for user management
            ...allergyRoutes,  // Routes for allergies
            ...predictRoutes  // Routes for predictions
        ]);

        console.log("Routes registered successfully.");
    } catch (error) {
        console.error("Failed to register routes:", error.message);
        process.exit(1); // Exit the process if routes fail validation
    }

    // Error handling middleware
    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    // Start the server
    try {
        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1); // Exit the process if server fails to start
    }
})();
