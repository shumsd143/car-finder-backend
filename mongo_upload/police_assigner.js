const mongodb=require('mongodb')
const mongoURI ='mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const objectId=mongodb.ObjectId

function unassigned_car(policeid,resp){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            resp.status(503)
            resp.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').find({police_assigned:false}).sort({_id:1}).toArray().then(res=>{
            if(res.length===0){
                resp.status(200)
                resp.send({status:'posted',result:policeid})
            }
            else{
                assign_police(policeid,res[0]._id,resp)
            }
        })
    })
}
function assign_police(policeid,car_id,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('policeinfo').updateOne({_id:objectId(policeid)},{$set:{task_assigned:car_id}},(err,resp)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }         
            assign_car(car_id,policeid,res)   
        })
    })
}
function assign_car(car_id,policeid,res){
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

module.exports.unassigned_car=unassigned_car