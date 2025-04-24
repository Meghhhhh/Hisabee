import 'dotenv/config'
import express from 'express';
import pool from './config/postgres-db.js';

const app = express();

app.get('/', async (req, res) => {
    const query = "SELECT NOW()"
    const result = await pool.query(query);
    console.log(result.rows[0].now);
    res.json("Hello worls")
});

app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}`));
