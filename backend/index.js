import 'dotenv/config'
import express from 'express';
import pool from './config/postgres-db.js';
import cors from "cors"

const app = express();

//initialisation for express app to read req and cors configs
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    const query = "SELECT NOW()"
    const result = await pool.query(query);
    console.log(result.rows[0].now);
    res.json("Hello worls")
});

app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}`));
