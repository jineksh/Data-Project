import express from 'express'
import {connectToDatabase} from './config/databse.js'
import "dotenv/config";
import dataSetRouter from './routes/dataset.route.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({extends : true}));

app.get('/health',(req,res,next)=>{
    res.json({
        message : 'Server is Started'
    })
})

app.use('api/v1/datasets',dataSetRouter);

app.listen(process.env.PORT,async()=>{

    await connectToDatabase();
    console.log('[Server] : Started')
});




