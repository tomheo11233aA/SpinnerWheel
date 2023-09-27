import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes.js';
import cors from 'cors';

const app = express();
app.use(express.json()); 
app.use(cors());
app.use("/api/user",router);


mongoose.connect('mongodb+srv://tomheo11233:tomheo11233@cluster0.q6ryeke.mongodb.net/?retryWrites=true&w=majority')
    .then(() => app.listen(8080)).then(() => console.log("DB Connected and Server Running in port 8080"))
    .catch(err => console.log(err));