const Ref = require('./ref.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

  title: {
    type: String,
    required: false,
    trim: true
  },

  author_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },

  username: {
    type: String,
    required: false,
  },

  display_photo_key: {
    type: String,
    required: false,
  },

  date: {
    type: Date
  },

  difficulty: {
    type: Number,
    required: false,
  },

  min_duration: {
    type: Number,
    required: false
  },

  subtitle: {
    type: String,
    required: false,
    trim: true
  },

  post_privacy_type: {
    type: String,
    required: false,
  },

  cover_photo_key: {
    type: String,
    required: false,
  },

  progression: {
    type: Number,
    required: false,
    trim: true
  },

  pursuit_category: {
    type: String,
    required: false,
    trim: true
  },

  post_format: {
    type: String,
    required: true,
  },

  is_milestone: {
    type: Boolean,
    required: false,
  },

  is_paginated: {
    type: Boolean,
    required: false
  },

  text_snippet: {
    type: String,
    required: false
  },

  text_data: {
    type: String,
    required: false
  },

  image_data: {
    type: [String],
    required: false,
  },

  internal_ref: {
    type: Ref.Schema,
    required: false
  },

  external_ref: {
    type: Ref.Schema,
    required: false
  },

  labels: {
    type: [String],
    default: []
  },

  comments: {
    type: [mongoose.Types.ObjectId],
    default: []
  },

  bookmarks: {
    type: [mongoose.Types.ObjectId],
    default: []
  }

}, {
  timestamps: true,
});

const PostModel = mongoose.model('post', PostSchema);

module.exports = {
  Schema: PostSchema,
  Model: PostModel
};