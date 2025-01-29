const express = require("express");

const app = express();

app.use(express.json());

// Register Route
const {registerRoute} = require("./routes/registerRoute");
const {loginRoute} = require("./routes/loginRoute");
const {modifyPolicy} = require("./routes/userPolicy");
const policyRouter = require("./routes/policyRoute");
const userRouter = require("./routes/userRoutes");
const claimRouter = require("./routes/claimRoute");
const {authenticateToken} = require("./middlewares/authenticateToken");

app.get("/", (req,res) => {
    res.status(200).json({message : "CLAIM MANAGEMENT SYSTEM"});
});

app.post("/api/register", registerRoute);
app.post("/api/login", loginRoute);
app.post("/api/user/policy",authenticateToken, modifyPolicy);

app.use("/api/users",authenticateToken, userRouter);
app.use("/api/policy",authenticateToken,policyRouter);
app.use("/api/claim",authenticateToken,claimRouter);


// Global Error Handler
app.use((err,req,res,next) => {
    res.status(404).json({message : `An unexpected Error Occurred : ${Err}`});
})


app.listen(3001, () => {
    console.log(`Server is running at port http://localhost:3001`);
});