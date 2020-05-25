const mongodb=require('mongodb')
const mongoURI ='mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const police_assigner=require('./police_assigner')
const objectId=mongodb.ObjectId

function post_police_data(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('policeinfo').insertOne(body,(err,result)=>{
            if(err){
                console.log('error while posting data')
                res.status(503)
                res.send({status:'failed',reason:'error while inserting data in db'})
                return 
            }
            police_assigner.unassigned_car(result.ops[0]._id,res)
        })
    })
}
function police_login(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('car-info').collection('policeinfo').findOne({'phone-number':body.phone},(err,result)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }
            if(!result){
                res.statusMessage='Phone is not registered'
                res.status(400)
                res.send({status:'failed'})
            }
            else{
                if(body.password===result.password){
                    res.status(200)
                    res.send({status:'success',data:result._id})
                }
                else{
                    res.statusMessage='Wrong password'
                    res.status(400)
                    res.send({status:'failed'})
                }
            }
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
        dbclient.db('car-info').collection('policeinfo').findOne({_id:objectId(id)},{fields:{username:1,'phone-number':1,'task_assigned':1,policeid:1}},(err,result)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }
            res.send(result)
        })
    })
}

module.exports.post_police_data=post_police_data
module.exports.police_login=police_login
module.exports.get_details=get_details