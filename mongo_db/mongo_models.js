const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date },
  updated_on: { type: Date },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  open: { type: Boolean },
  status_text: { type: String },
});
const issue = mongoose.model("issue", issueSchema);

const projectSchema = new Schema({
  name: { type: String, required: true },
  issues: [issueSchema],
});
const project = mongoose.model("project", projectSchema);

exports.issue = issue;
exports.project = project;
