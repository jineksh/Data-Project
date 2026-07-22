import express from 'express'
import {connectToDatabase} from './config/databse.js'
import "dotenv/config";


const app = express();

app.get('/health',(req,res,next)=>{
    res.json({
        message : 'Server is Started'
    })
})

app.listen(process.env.PORT,async()=>{

    await connectToDatabase();
    console.log('[Server] : Started')
});




