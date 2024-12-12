const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const allergyRoutes = require('./routes/allergyRoutes');
const predictRoutes = require('./routes/predictRoutes');
const loadModel = require('./services/loadModel');
const InputError = require('./exceptions/InputError');

dotenv.config();

(async () => {
    try {
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

        server.route([
            ...authRoutes,
            ...userRoutes,
            ...allergyRoutes,  // Menambahkan rute alergi
            ...predictRoutes,
        ]);

        server.ext('onPreResponse', (request, h) => {
            const response = request.response;

            if (response instanceof InputError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: `${response.message}`,
                });
                newResponse.code(response.output.statusCode);
                return newResponse;
            }

            if (response.isBoom) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.output.statusCode);
                return newResponse;
            }

            return h.continue;
        });

        await server.start();
        console.log(`Server is running at: ${server.info.uri}`);
    } catch (err) {
        console.error('Failed to start the server', err);
        process.exit(1);
    }
})();
