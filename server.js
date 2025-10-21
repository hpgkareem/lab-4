const {app}= require('./index');
const PORT=3000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})