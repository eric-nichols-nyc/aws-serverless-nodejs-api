const serverless = require("serverless-http");
const express = require("express");
const {getDbClient} = require('./db/clients')
const crud = require('./db/crud')
const validate = require('./db/validators')

const app = express();
app.use(express.json());

// 1 - add dbClient

app.get("/", async(req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now();

  const [dbNowResult] = await sql`select now();`
  const delta = (dbNowResult.now.getTime() - now) / 1000
  return res.status(200).json({
    message: "Hello from root!",
    delta: delta,
  });
});

app.get("/api/leads", async(req, res, next) => {
  const results = await crud.listLeads()
  return res.status(200).json({
    message: "Hello from leads!",
    results: results,
  });
});


app.post("/api/leads", async(req, res, next) => {
  // POST -> create dagta
  const postData = await req.body;
  // validate data

  const {data, hasError, message} = await validate.validateLead(postData)

  if (hasError) {
    return res.status(400).json({
      message: message,
    });
  } else if (!data) {
    return res.status(400).json({
      message: "Invalid data",
    });
  } else {
    const result = await crud.newLead(data);
    return res.status(200).json({
      message: "Hello from leadds!",
      result: result,
    });
  }
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
const PORT = process.env.PORT || 3000;
// connect exppress to port 3000
app.listen(PORT, () => {
  console.log(`"Server is running on port ${PORT}"`);
});


module.exports.handler = serverless(app);
