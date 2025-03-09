import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swaggerConfig';
import dotenv from 'dotenv';
import Logger from './utils/logger';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.frzuroc.mongodb.net/API?retryWrites=true&w=majority`; // Updated connection string

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => Logger.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  Logger.log(`Server is running on port ${PORT}`);
});
