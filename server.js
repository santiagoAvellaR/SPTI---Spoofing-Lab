import express, { json } from 'express';
import { join, dirname } from 'node:path';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import Joi from 'joi';
config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mongo = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }, tls: true,
});
const saveData = async (userid, password) => {
    try {
        const db = mongo.db(process.env.DB_NAME);
        const collectionName = process.env.DB_COLLECTION;
        if (!collectionName) {
            throw new Error("DB_COLLECTION is not defined in the environment variables.");
        }
        const collection = db.collection(collectionName);
        await collection.insertOne({ userid, password });
    } catch (error) {
        console.error(`Failed to save data: ${error}`);
    }
};
const app = express();
const PORT = process.env.PORT || 3000;
const corOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
};
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname)));
app.use((err, _req, _res, _next) => {
    console.error(err.stack);
})
app.get('/', (_req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});
const loginSchema = Joi.object({
    userid: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
});
app.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).send(`Validation error: ${req.body}`);
    }
    const { userid, password } = req.body;
    try {
        await saveData(userid, password);
        res.status(200).send('Data saved successfully!');
    } catch (err) {
        console.error(`Failed to save data: ${err}`);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, async () => {
    try {
        await mongo.connect();
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error(`Failed to connect to MongoDB: ${error}`);
    }
});