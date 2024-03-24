// modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const multer = require("multer");
const imageKit = require("imagekit");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

// init
const app = express();
const port = process.env.PORT || 9001;
const uploadMulter = multer();

// control cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionSuccessStatus: 200,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// imagekit authentication
const imagekit = new imageKit({
  publicKey: process.env.IK_PL_KEY,
  privateKey: process.env.IK_PV_KEY,
  urlEndpoint: `https://ik.imagekit.io/` + process.env.IK_ID,
});

// upload image to imagekit
const uploadToIK = async (req, res) => {
  let fieldName = req.file.fieldname.replace("Img", "");

  switch (fieldName) {
    case "user":
      fieldName = "users";
      break;
    case "group":
      fieldName = "groups";
      break;
    case "post":
      fieldName = "posts";
      break;
    default:
      fieldName = "";
  }

  imagekit
    .upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `travelago/${fieldName}`,
    })
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
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

// self verification
const verifySelf = async (req, res, next) => {
  if (req.decoded._id !== req.params.identifier)
    return res.status(403).send({ error: true, message: "Forbidden access!" });

  next();
};

// mongodb config
const mdbClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async (_) => {
  try {
    const users = mdbClient.db("travelago").collection("users");
    const groups = mdbClient.db("travelago").collection("groups");
    const posts = mdbClient.db("travelago").collection("posts");

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
    app.post("/users/upload-ui", uploadMulter.single("userImg"), uploadToIK);

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
      let filterUsers = {};

      if (req.query.method === "connect")
        filterUsers = { $in: [req.params.identifier] };
      if (req.query.method === "not-connect")
        filterUsers = { $nin: [req.params.identifier] };

      const query = {
        owner: { $not: { $eq: req.params.identifier } },
        users: filterUsers,
      };
      const cursor = groups.find(query).sort({ groupName: 1 });
      const result = await cursor.toArray();

      res.send(result);
    });

    // get limited groups data
    app.get("/groups/limit/:identifier", verifyJWT, async (req, res) => {
      let filterUsers = {};

      if (req.query.method === "not-connect")
        filterUsers = { $nin: [req.params.identifier] };

      const query = {
        owner: { $not: { $eq: req.params.identifier } },
        users: filterUsers,
      };
      const cursor = groups
        .find(query)
        .limit(+req.query.limit || 0)
        .sort({ groupName: 1 });
      const result = await cursor.toArray();

      res.send(result);
    });

    // get specific group data
    app.get("/groups/id/:gid", verifyJWT, async (req, res) => {
      const query = { _id: new ObjectId(req.params.gid) };
      const result = await groups.findOne(query);

      res.send(result);
    });

    // get group users data
    app.get("/group/users/:gid", verifyJWT, async (req, res) => {
      const query = {
        groups: { $in: [req.params.gid] },
      };
      const cursor = users.find(query).sort({ fullName: 1 });
      const result = await cursor.toArray();

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
      uploadMulter.single("groupImg"),
      uploadToIK
    );

    // connect group
    app.put("/groups/connect/:uid/:gid", verifyJWT, async (req, res) => {
      await users.updateOne(
        { _id: req.params.uid },
        {
          $push: { groups: req.params.gid },
        }
      );

      await groups.updateOne(
        { _id: new ObjectId(req.params.gid) },
        {
          $push: { users: req.params.uid },
        }
      );

      res.status(200).send({ success: true, message: "OK!" });
    });

    // disconnect group
    app.put("/groups/disconnect/:uid/:gid", verifyJWT, async (req, res) => {
      await users.updateOne(
        { _id: req.params.uid },
        {
          $pull: { groups: req.params.gid },
        }
      );

      await groups.updateOne(
        { _id: new ObjectId(req.params.gid) },
        {
          $pull: { users: req.params.uid },
        }
      );

      res.status(200).send({ success: true, message: "OK!" });
    });

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

    // get user connected groups all posts
    app.get(
      "/posts/users/:identifier",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const user = await users.findOne({ _id: req.params.identifier });

        if (!user.groups) user.groups = [];

        const groupsResult = await groups
          .find({ owner: req.params.identifier }, { projection: { _id: 1 } })
          .toArray();

        const groupIds = [];
        groupsResult.forEach((group) => groupIds.push(group._id.toString()));

        const query = { group_id: { $in: [...user.groups, ...groupIds] } };
        const cursor = posts.find(query).sort({ date: -1 });
        const result = await cursor.toArray();

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
    app.post(
      "/posts/upload-pi",
      verifyJWT,
      uploadMulter.single("postImg"),
      uploadToIK
    );

    // test mongodb connection
    mdbClient
      .db("admin")
      .command({ ping: 1 })
      .then((_) => console.log("Successfully connected to MongoDB!"));
  } catch (err) {
    console.log("Did not connect to MongoDB! " + err.message);
  } finally {
    // await mdbClient.close();
  }
})();

// get jwt token
app.post("/jwt", (req, res) => {
  const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.send(token);
});

// check api running or not
app.get("/", (req, res) => {
  res.send("Travelago is running...");
});

app.listen(port, (_) => {
  console.log(`Travelago API is running on port: ${port}`);
});
