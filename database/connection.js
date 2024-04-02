const mongoose = require("mongoose");
console.log(process.env.MONGODB_URI)
mongoose
  .connect(process.env.MONGODB_URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));