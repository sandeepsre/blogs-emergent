import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Emergent Blog CMS API',
            version: '1.0.0',
            description: 'API documentation for the Emergent Blog CMS',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `${url}/api`,
                description: 'API Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [join(__dirname, '../routes/*.js')], // Files containing annotations
};

export const swaggerSpec = swaggerJsdoc(options);
