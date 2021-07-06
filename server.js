'use strict'

const express = require('express');
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');

const app=express();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT

//server
app.get('/getData',drinkData)
app.post('/favFunc',favFunc)
app.get('/getFavData',getFavData)
app.delete('/deleteFunc',deleteFunc)
app.put('/updateFunc/:index',updateFunc)

//mongo
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://Ahmad-Sailik:Ahmad4321@can-book-shard-00-00.gjuvo.mongodb.net:27017,can-book-shard-00-01.gjuvo.mongodb.net:27017,can-book-shard-00-02.gjuvo.mongodb.net:27017/test?ssl=true&replicaSet=atlas-6wqbv4-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const drinkSchema=new mongoose.Schema({
    strDrinkThumb:String,
    strDrink:String,
})
const drinkModel=mongoose.model('drink',drinkSchema)


//function
function drinkData (req,res){
    URL=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios.get(URL).then(dataDrink=>{
        res.send(dataDrink.data.drinks)
    })
}
function favFunc(req,res){
    const{strDrinkThumb,strDrink}=req.body;
    const item =new drinkModel({
        strDrinkThumb:strDrinkThumb,
        strDrink:strDrink,

    })
    item.save()
} 
function getFavData(req,res){
    drinkModel.find({},(err,data)=>{
        res.send(data);
    })
}
function deleteFunc(req,res){
    const{id}=req.query;
    drinkModel.deleteOne({_id:id},(err,data)=>{
        drinkModel.find({},(err,data)=>{
            res.send(data);
        })  
    })
}

function updateFunc(req,res){
    const{strDrinkThumb,strDrink,id}=req.body;
    const index=Number(req.params.index)
    drinkModel.find({},(err,data)=>{
        data[index].strDrinkThumb=strDrinkThumb;
        data[index].strDrink=strDrink;
        data[index].save()
        .then(()=>{
            drinkModel.find({},(err,data)=>{
                res.send(data);
            })
        })
        
    })
}



app.listen(PORT,()=>console.log(`listen on ${PORT}`))