const express=require("express")
const mongodb=require("mongodb")
const bodyParser = require('body-parser');
const path=require("path")



const app=express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"/../")))



const MongoClient=mongodb.MongoClient
const connectionUrl="mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true"


const port=process.env.PORT || 3000



//main page set
app.get("/",(request,response)=>{
	response.sendFile(path.join(__dirname,"/../public/main.html"))
})


//POST request handle
app.post("/",(request,response)=>{

	MongoClient.connect(connectionUrl,(error,client)=>{
		if (error){
			return response.send({
				error: "Unable to connect"
			})		
		}


		const db=client.db("getir-case-study")
		

		const startDate=new Date(request.body.startDate)
		const endDate=new Date(request.body.endDate)
		const minCount=request.body.minCount
		const maxCount=request.body.maxCount

		//Response Payload filter regarding requested format
		db.collection("records").aggregate([
			{ $project: {
				_id: 0,
				key: 1,
				createdAt: 1,
				totalCount: {
					$reduce: {
						input: "$counts",
						initialValue: 0,
						in: { $add: ["$$value", "$$this"]}
					}
				},
			}}, 
			{ $match: {
				totalCount: {
					$gt: minCount,
					$lt: maxCount
					}
				}
			},
			{ $match: {
				createdAt: {
					$gt: startDate,
					$lt: endDate }
				}
			}	
		]).toArray((error,result)=>{
			if (error){
				return response.send({
					code:-1,
					msg: "Unable to prepare the requested format"
				})
			}
			if (result.length==0){
				return response.send({
					code:0,
					msg:"There are no record available according to the request"
				})
			}
			response.send({
				code:0,
				msg:"Success",
				records: result
			})
		})
	})	
})



app.listen(port)