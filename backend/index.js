import 'dotenv/config';
import express from 'express';
import pool from './config/postgres-db.js';
import createTables from './database/createTables.js';
import asyncHandler from './utils/asyncHandler.js';
import errorHandler from './utils/errorHandler.js';
import responseHandler from "./utils/responsehandler.js"
import cors from 'cors';

const app = express();

//initialisation for express app to read req and cors configs
app.use(express.json());
app.use(cors());

createTables()
  .then(() => {
    console.log('All Tables created or already exist');

    app.get(
      '/',
      asyncHandler(async (req, res) => {
        const query = 'SELECT NOW()';
        const result = await pool.query(query);
        console.log(result.rows[0].now);
        responseHandler(res, 200, "Hello World")
      }),
    );

    app.use(errorHandler);

    app.listen(process.env.PORT, () =>
      console.log(`app listening on port ${process.env.PORT}`),
    );
  })
  .catch(err => console.error('Error creating the tables', err));
