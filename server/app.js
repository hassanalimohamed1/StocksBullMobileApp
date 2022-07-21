const express = require("express");

const app = express();
app.use(express.json());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AWS = require("aws-sdk");

const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

let token = null;
let email = null;
let aa = "";
let id = uuidv4();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

//Verfiy JWT and check expiration date
const serectkey = process.env.SECERT_KEY;

const dynamoClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

const USERS = "users";
const WATCHLIST = "watchlist";

app.get("/", (req, res) => {
  res.json("hi");
});

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(req.headers.authorization.split(" ")[0]);

  //Retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
    console.log("Token: ", token);
  } else {
    res.status(401).json({ error: true, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, serectkey);

    //setting email
    email = decoded.email;
    if (decoded.exp < Date.now()) {
      console.log("Token has expired");
      return;
    }
    console.log("Token valid");
    next();
  } catch (err) {
    console.log("Token is not valid: ", err);
  }
};

app.post("/update", authorize, async function (req, res) {
  console.log(req.body.watchlist, aa, "REACHED!");
  if (!req.body.watchlist) {
    res.status(400).json({ Message: "Error updating watchlist" });
    return;
  }

  // Adding to the watchlist
  const params = {
    TableName: WATCHLIST,
    Item: {
      id: id,
      email: aa,
      symbol: req.body.watchlist,
    },
  };

  try {
    await dynamoClient.put(params).promise();
    res.status(201).json({
      message: `Successful added stock symbol ${req.body.watchlist}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Database error - not updated" });
  }
});

app.post("/login", async function (req, res, next) {
  const email1 = req.body.email;
  const password = req.body.password;

  if (!email1 || !password) {
    res.status(400).json({
      error: true,
      message:
        "The email address or password you entered isn't connected to an account.",
    });
    return;
  }

  const params = {
    TableName: USERS,
    ProjectionExpression: "email, id, password",
    FilterExpression: "email = :emailAddress",
    ExpressionAttributeValues: {
      ":emailAddress": email1,
    },
  };

  const queryUsers = await dynamoClient.scan(params).promise();

  if (queryUsers.Count === 0) {
    res.status(401).json({
      error: true,
      message:
        "The email address or password you entered isn't connected to an account.",
    });

    return;
  }

  const match = await bcrypt.compare(password, queryUsers.Items[0].password);

  if (!match) {
    res.status(401).json({
      error: true,
      message: "Please enter a valid email address or password.",
    });
    return;
  }

  const expires_in = 60 * 60 * 24;

  const exp = Date.now() + expires_in * 1000;

  const token = jwt.sign({ email, exp }, serectkey);

  aa = email1;

  console.log(email, "email");

  res.status(201).json({
    token_type: "Bearer",
    token,
    expires_in,
    message: "Successfully logged in.",
  });
});

app.get("/retrieve", authorize, async function (req, res) {
  //Getting the data from watchlist

  console.log(aa, "aa");

  const params = {
    TableName: WATCHLIST,
    ProjectionExpression: "symbol",
    FilterExpression: "email = :emailAddress",
    ExpressionAttributeValues: {
      ":emailAddress": aa,
    },
  };
  const watchlist = await dynamoClient.scan(params).promise();

  let newwl = [];
  for (var stock in watchlist.Items) {
    newwl.push(watchlist.Items[stock].symbol);
  }
  console.log(watchlist);
  try {
    res.send(newwl);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
});

app.delete("/delete", authorize, async function (req, res) {
  console.log(req.body.symbol);

  const params = {
    TableName: WATCHLIST,
    ProjectionExpression: "id",
    FilterExpression: "email = :emailAddress AND symbol = :sYmbol",
    ExpressionAttributeValues: {
      ":emailAddress": aa,
      ":sYmbol": req.body.symbol,
    },
  };

  const watchlist = await dynamoClient.scan(params).promise();

  console.log(watchlist);

  let symbol = watchlist.Items[0].id;

  var params2 = {
    TableName: WATCHLIST,
    Key: {
      id: { S: symbol },
    },
  };

  dynamodb.deleteItem(params2, function (err, data) {
    if (err) {
      res.status(500).json({ message: "row not deleted" });
    } else {
      res.status(201).json({
        message: `Successful deleted stock symbol ${req.body.symbol}`,
      });
    }
  });
});

app.post("/register", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Please enter a valid email address or password.",
    });
    return;
  }

  const params = {
    TableName: USERS,
    ProjectionExpression: "email",
    FilterExpression: "email = :emailAddress",
    ExpressionAttributeValues: {
      ":emailAddress": email,
    },
  };

  const queryUsers = await dynamoClient.scan(params).promise();

  if (queryUsers.Count > 0) {
    res.status(401).json({
      error: true,
      message: "The email address entered is already connected to an account.",
    });

    return;
  }

  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  const params2 = {
    TableName: USERS,
    Item: {
      id: id,
      email: email,
      password: hash,
    },
  };

  const adduser = await dynamoClient.put(params2).promise();

  res
    .status(201)
    .json({ error: false, message: "Successfully created account." });
});

const PORT = process.env.port || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
