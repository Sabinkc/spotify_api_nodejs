const express = require("express");
const MusicController = require("../controllers/music_controller");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth_middleware");

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.single("music"),
  MusicController.createMusic,
);
router.post("/album", authMiddleware.authArtist, MusicController.createAlbum);
router.get("/album", authMiddleware.authUser, MusicController.getAllAlbums);

router.get("/", authMiddleware.authUser, MusicController.getAllMusics);

router.get(
  "/album/:album_id",
  authMiddleware.authUser,
  MusicController.getAlbumById,
);

module.exports = router;
