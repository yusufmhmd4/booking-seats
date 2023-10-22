const express=require("express")
const app=express()
app.use(express.json())
const path=require('path')
const { open }=require('sqlite')
const sqlite3=require('sqlite3')
const cors=require("cors")
app.use(cors())
const databasePath=path.join(__dirname,"./movie.db")
console.log(databasePath)

let  db=null;

const initializeAndServer=async()=>{
    try{
        db=await open({
            filename:databasePath,
            driver:sqlite3.Database
        })

        app.listen(3000,()=>{
            console.log(`Server is running on 3000`)
        })

    }catch(e){
        console.log(`Error is ${e.message}`)
        process.exit(1)
    }
}
initializeAndServer()

app.get('/seats',async (request,response)=>{
    const getAllSeatsQuery=`
    SELECT * FROM seats;
    `
    const responseData=await db.all(getAllSeatsQuery)
    response.send(responseData)
   // console.log(response)
})


app.put("/seats/booking",async(request,response)=>{
    const { bookingList}=request.body
    try{
        for(let seatId of bookingList){
            const changeSeatStatus=`
            UPDATE seats SET status= 'booked'
            WHERE id=${seatId}
            `
            await db.run(changeSeatStatus)
        }
        response.send('Seats successfully booked.')
    }catch(e){
        response.status(400)
        response.send(`Error booking seats: ${error.message}`)
    }
})
