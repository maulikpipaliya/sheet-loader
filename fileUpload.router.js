const { Router } = require("express");

const imageUpload = require("./fileUpload.middleware");

const router = Router({
  mergeParams: true,
});

router.post(
<<<<<<< HEAD
    "/uploadfile",
    imageUpload.single("excel"),
    (req, res) => {
        console.log("vfnbjdnbfdj");
        res.send(req.file);
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
=======
  "/uploadfile",
  imageUpload.single("file"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
>>>>>>> c1ecba56f3daf3d268713b8dc681753bbd3b00f0
);

router.post(
  "/uploadBulkfiles",
  imageUpload.array("excel", 2),
  (req, res) => {
    res.send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
