const musicModel = require("../models/music_model");
const jwt = require("jsonwebtoken");
const uploadFile = require("../services/storage_service");
const albumModel = require("../models/album_model");

async function createMusic(req, res) {
  const title = req.body.title;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString("base64"));

  await musicModel.create({
    title: title,
    url: result.url,
    artist: req.user.id,
  });
  res.status(201).json({
    message: "Music created successfully",
    music: {
      title: title,
      url: result.url,
      artist: req.user.id,
      url: result.url,
    },
  });
}

async function createAlbum(req, res) {
  const album = await albumModel.create({
    title: req.body.title,
    artist: req.user.id,
    musics: req.body.musics,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: {
      title: album.title,
      artist: album.artist,
      musics: album.musics,
      id: album._id,
    },
  });
}

module.exports = { createMusic, createAlbum };
