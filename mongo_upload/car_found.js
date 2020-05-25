const mongodb=require('mongodb')
const mongoURI ='mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const objectId=mongodb.ObjectId

function car_founded(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').updateOne({_id:objectId(body.car_id)},{$set:{status:'found'}},(err,resp)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }         
            assign_anothercar(body.police_id,res)   
        })
    })
}
function assign_anothercar(police_id,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').find({police_assigned:false}).sort({_id:1}).toArray().then(resp=>{
            if(resp.length===0){
                assign_police(police_id,'',res)
            }
            else{
                assign_police(police_id,resp[0]._id,res)
            }
        })
    })
}
function assign_police(police_id,car_id,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('policeinfo').updateOne({_id:objectId(police_id)},{$set:{task_assigned:car_id}},(err,resp)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }
            if(car_id===""){
                res.status(200)
                res.send({status:'success'})
            }
            else{
                updatecar(police_id,car_id,res)
            }            
        })
    })
}
function updatecar(policeid,car_id,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').updateOne({_id:objectId(car_id)},{$set:
            {police_assigned:true,police_info:policeid}},(err,resp)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }         
            res.status(200)
            res.send({status:'success'})
        })
    })
}


module.exports.car_founded=car_founded