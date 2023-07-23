// modules
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const multer = require("multer");
const imageKit = require("imagekit");
const jwt = require("jsonwebtoken");

// init
const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ dest: "uploads/" });

// control cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());

// mongodb config
const mdbClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// imagekit authentication
const imagekit = new imageKit({
  publicKey: process.env.IK_PL_KEY,
  privateKey: process.env.IK_PV_KEY,
  urlEndpoint: `https://ik.imagekit.io/` + process.env.IK_ID,
});

// upload user image to imagekit
const uploadUI = async (req, res) => {
  const imgBuffer = await fs.promises.readFile(req.file.path);

  await imagekit
    .upload({
      file: imgBuffer,
      fileName: req.file.originalname,
      folder: "travelago/users",
    })
    .then((response) => {
      fs.unlinkSync(req.file.path);
      res.send(response);
    })
    .catch((error) => {
      fs.unlinkSync(req.file.path);
      res.send(error);
    });
};

// verify token from client
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access!" });

  jwt.verify(
    authorization.split(" ")[1],
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err)
        return res
          .status(403)
          .send({ error: true, message: "Forbidden access!" });

      req.decoded = decoded;
      next();
    }
  );
};

(async (_) => {
  try {
    const users = mdbClient.db("travelago").collection("users");

    // self verification
    const verifySelf = async (req, res, next) => {
      if (req.decoded._id !== req.params.identifier)
        return res
          .status(403)
          .send({ error: true, message: "Forbidden access!" });

      next();
    };

    app.get(
      "/self/users/:identifier",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { _id: req.params.identifier };
        const result = await users.findOne(query);

        res.send(result);
      }
    );

    // create user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { _id: user._id };
      const exist = await users.findOne(query);

      if (exist)
        return res.send({ error: true, message: "User already exist!" });

      const result = await users.insertOne(user);

      res.send(result);
    });

    // upload user image to server
    app.post("/users/upload-ui", upload.single("userImg"), uploadUI);

    // test mongodb connection
    mdbClient
      .db("admin")
      .command({ ping: 1 })
      .then((_) => console.log("Successfully connected to MongoDB!"));
  } catch (err) {
    console.log("Did not connect to MongoDB! " + err.message);
  } finally {
    await mdbClient.close();
  }
})();

// check api running or not
app.get("/", (req, res) => {
  res.send("Travelago is running...");
});

// get jwt token
app.post("/jwt", (req, res) => {
  const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.send(token);
});

app.listen(port, (_) => {
  console.log(`Travelago API is running on port: ${port}`);
});
