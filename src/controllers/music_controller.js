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

async function getAllMusics(req, res) {
  const musics = await musicModel.find().populate("artist", "username email");

  res.status(200).json({
    message: "Musics fetched successfully",
    musics: musics,
  });
}

async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .select("artist title")
    .populate("artist", "username email");

  res.status(200).json({
    message: "Albums fetched successfully",
    albums: albums,
  });
}

async function getAlbumById(req, res) {
  const album_id = req.params.album_id;
  const album = await albumModel.findById(album_id).populate("musics");

  if (!album) {
    return res.status(404).json({
      message: "Album not found",
    });
  }

  res.status(200).json({
    message: "Musics fetched successfully",
    album: album,
  });
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };
