const { Router } = require("express");

const imageUpload = require("./fileUpload.middleware");

const router = Router({
  mergeParams: true,
});

router.post(
  "/uploadfile",
  imageUpload.single("file"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
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
