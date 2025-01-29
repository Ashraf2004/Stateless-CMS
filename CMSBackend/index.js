const express = require("express");

const app = express();

app.use(express.json());

// Register Route
const {registerRoute} = require("./routes/registerRoute");
const {loginRoute} = require("./routes/loginRoute");
const policyRouter = require("./routes/policyRoute");
const userRouter = require("./routes/userRoutes");

app.get("/", (req,res) => {
    res.status(200).json({message : "CLAIM MANAGEMENT SYSTEM"});
});

app.post("/api/register", registerRoute);
app.post("/api/login", loginRoute);

app.use("/api/users", userRouter);
app.use("/api/policy",policyRouter);



app.listen(3001, () => {
    console.log(`Server is running at port http://localhost:3001`);
});