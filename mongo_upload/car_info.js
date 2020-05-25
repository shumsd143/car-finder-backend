const mongodb=require('mongodb')
const mongoURI = 'mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const car_assigner=require('./car_assigner')
const objectId=mongodb.ObjectId

function post_car_data(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connection failed')
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').insertOne(body,(err,result)=>{
            if(err){
                console.log('error while posting data')
                res.status(503)
                res.send({status:'failed',reason:'error while inserting data in db'})
                return 
            }
            car_assigner.unassigned_police(result.ops[0]._id,res)
        })
    })
}    

function getCar(params,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connection failed')
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').findOne({'Car-Number':params}).then(data=>{
            if(data){
                res.status(200)
                res.send({status:'found',data:data})
                return
            }
            res.status(404)
            res.send({status:'not found'})
        })
    })
}
function get_details(id,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('registeredcar').findOne({_id:objectId(id)},{},(err,result)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }
            res.send(result)
        })
    })
}

module.exports.getCar=getCar
module.exports.post_car_data=post_car_data
module.exports.get_details=get_details