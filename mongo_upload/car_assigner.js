const mongodb=require('mongodb')
const mongoURI ='mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const objectId=mongodb.ObjectId

function unassigned_police(carid,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('policeinfo').find({task_assigned:""}).sort({_id:1}).toArray().then(resp=>{
            if(resp.length===0){
                res.status(200)
                res.send({status:'posted'})
            }
            else{
                assign_car(carid,resp[0]._id,res)
            }
        })
    })
}
function assign_car(carid,police_id,res){
    console.log('hit2')
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('policeinfo').updateOne({_id:objectId(police_id)},{$set:{task_assigned:carid}},(err,resp)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }         
            assign_police(carid,police_id,res)   
        })
    })
}
function assign_police(car_id,policeid,res){
    console.log('hit3')
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

module.exports.unassigned_police=unassigned_police