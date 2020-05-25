const express=require('express')
const bodyparser=require('body-parser')
const cloudinary=require('cloudinary').v2
const fileupload=require('express-fileupload')
const car_info=require('./mongo_upload/car_info')
const police_info=require('./mongo_upload/police_info')
const police_assigner=require('./mongo_upload/police_assigner')
const car_found=require('./mongo_upload/car_found')
const cors=require('cors')

const app = express()
app.use(bodyparser.json())
app.use(fileupload({
    useTempFiles:true
}))
app.use(cors())

cloudinary.config({
    cloud_name:'shumsd143',
    api_key:'788739654851395',
    api_secret:'1HzVIf97q5AQvGcUtQHmPtGvA9I'
})
app.post('/upload',(req,res)=>{
    const file=req.files.image
    cloudinary.uploader.upload(file.tempFilePath,function(err,result){
        if(err){
            res.status(500)
            res.send({status:false})
            return
        }
        res.status(200)
        res.send({
            url:result.url,
            status:true
        })
    }) 
})
app.post('/info',(req,res)=>{
    car_info.post_car_data(req.body,res)
})
app.get('/car/status/:car_number',(req,res)=>{
    car_info.getCar(req.params.car_number,res)
})
app.post('/police/signup',(req,res)=>{
    police_info.post_police_data(req.body,res)
})
app.post('/police/login',(req,res)=>{
    police_info.police_login(req.body,res)
})
app.get('/police/info/:id',(req,res)=>{
    police_info.get_details(req.params.id,res)
})
app.get('/car/detail/:id',(req,res)=>{
    car_info.get_details(req.params.id,res)
})
app.post('/car/found',(req,res)=>{
    car_found.car_founded(req.body,res)  
})

const port=process.env.PORT || 4000

app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})