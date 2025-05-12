import 'dotenv/config';
import express from 'express';
import pool from './config/postgres-db.js';
import createTables from './database/createTables.js';
import asyncHandler from './utils/asyncHandler.js';
import errorHandler from './utils/errorHandler.js';
import responseHandler from './utils/responsehandler.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/user.route.js"
import cors from 'cors';

const app = express();

//initialisation for express app to read req and cors configs
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],
  exposedHeaders: ['Set-Cookie'],
};
app.use(cors(corsOptions));

createTables()
  .then(() => {
    console.log('All Tables created or already exist');

    app.get(
      '/',
      asyncHandler(async (req, res) => {
        const query = 'SELECT NOW()';
        const result = await pool.query(query);
        console.log(result.rows[0].now);
        responseHandler(res, 200, 'Hello World');
      }),
    );

    // Routes 
    app.use('/api/v1/user', userRoute);

    // error handling 
    app.use(errorHandler);

    app.listen(process.env.PORT, () =>
      console.log(`app listening on port ${process.env.PORT}`),
    );
  })
  .catch(err => console.error('Error creating the tables', err));
