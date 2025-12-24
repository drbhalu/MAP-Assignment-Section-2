const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

let mobiles = [];

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(null, false);
  }
});

// CREATE
app.post("/api/mobiles",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  (req, res) => {
    const mobile = {
      id: Date.now(),
      model: req.body.model,
      price: req.body.price,
      coverImage: req.files.coverImage[0].path,
      images: req.files.images.map(i => i.path)
    };
    mobiles.push(mobile);
    res.json(mobile);
  }
);

// READ
app.get("/api/mobiles", (req, res) => {
  res.json(mobiles);
});

// UPDATE
app.put("/api/mobiles/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  (req, res) => {
    const mobile = mobiles.find(m => m.id == req.params.id);

    mobile.model = req.body.model;
    mobile.price = req.body.price;

    if (req.files.coverImage) {
      fs.unlinkSync(mobile.coverImage);
      mobile.coverImage = req.files.coverImage[0].path;
    }

    if (req.files.images) {
      mobile.images.forEach(img => fs.unlinkSync(img));
      mobile.images = req.files.images.map(i => i.path);
    }

    res.json(mobile);
  }
);

// DELETE
app.delete("/api/mobiles/:id", (req, res) => {
  const index = mobiles.findIndex(m => m.id == req.params.id);

  fs.unlinkSync(mobiles[index].coverImage);
  mobiles[index].images.forEach(img => fs.unlinkSync(img));

  mobiles.splice(index, 1);
  res.send("Deleted");
});

app.listen(5000, () => console.log("Server running on 5000"));
