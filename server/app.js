// modules
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

// upload group image to imagekit
const uploadGI = async (req, res) => {
  const imgBuffer = await fs.promises.readFile(req.file.path);

  await imagekit
    .upload({
      file: imgBuffer,
      fileName: req.file.originalname,
      folder: "travelago/groups",
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

// upload group post image to imagekit
const uploadPI = async (req, res) => {
  const imgBuffer = await fs.promises.readFile(req.file.path);

  await imagekit
    .upload({
      file: imgBuffer,
      fileName: req.file.originalname,
      folder: "travelago/posts",
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
    const groups = mdbClient.db("travelago").collection("groups");
    const posts = mdbClient.db("travelago").collection("posts");

    // self verification
    const verifySelf = async (req, res, next) => {
      if (req.decoded._id !== req.params.identifier)
        return res
          .status(403)
          .send({ error: true, message: "Forbidden access!" });

      next();
    };

    // get self user data
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

    // get specific user data
    app.get("/users/:uid", verifyJWT, async (req, res) => {
      const query = { _id: req.params.uid };
      const options = {
        projection: {
          fullName: 1,
          userImg: 1,
        },
      };
      const result = await users.findOne(query, options);

      res.send(result);
    });

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

    // get self groups data
    app.get(
      "/self/groups/:identifier",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { owner: req.params.identifier };
        const cursor = groups.find(query).sort({ groupName: 1 });
        const result = await cursor.toArray();

        res.send(result);
      }
    );

    // get all groups data
    app.get("/groups/:identifier", verifyJWT, async (req, res) => {
      const query = { owner: { $not: { $eq: req.params.identifier } } };
      const cursor = groups.find(query).sort({ groupName: 1 });
      const result = await cursor.toArray();

      res.send(result);
    });

    // get specific group data
    app.get("/groups/id/:gid", verifyJWT, async (req, res) => {
      const query = { _id: new ObjectId(req.params.gid) };
      const result = await groups.findOne(query);

      res.send(result);
    });

    // create group
    app.post("/groups/:identifier", verifyJWT, verifySelf, async (req, res) => {
      const group = req.body;
      const result = await groups.insertOne(group);

      res.send(result);
    });

    // upload group image to server
    app.post(
      "/groups/upload-gi/:identifier",
      verifyJWT,
      verifySelf,
      upload.single("groupImg"),
      uploadGI
    );

    // delete group
    app.delete(
      "/self/groups/:identifier/:gid/:imageId",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { _id: new ObjectId(req.params.gid) };
        const result = await groups.deleteOne(query);

        if (result.deletedCount) await imagekit.deleteFile(req.params.imageId);

        res.send(result);
      }
    );

    // get all group posts data
    app.get("/posts/:gid", verifyJWT, async (req, res) => {
      const query = { group_id: req.params.gid };
      const cursor = posts.find(query).sort({ date: -1 });
      const result = await cursor.toArray();

      res.send(result);
    });

    // create group post
    app.post("/posts", verifyJWT, async (req, res) => {
      const post = req.body;
      const result = await posts.insertOne(post);

      res.send(result);
    });

    // upload group post image to server
    app.post("/posts/upload-pi", verifyJWT, upload.single("postImg"), uploadPI);

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
