"use strict";

const issueModel = require("../mongo_db/mongo_models").issue;
const projectModel = require("../mongo_db/mongo_models").project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      console.log("============================================");
      let project = req.params.project;
      projectModel.findOne({ name: project }, (err, projectData) => {
        if (err) console.log("An error occured while getting requested project data");
        let filtered_data = projectData.issues.filter((issue) => {
          let condition_id = req.query._id ? issue._id == req.query._id : true;
          let condition_issue_title = req.query.issue_title ? issue.issue_title === req.query.issue_title : true;
          let condition_issue_text = req.query.issue_text ? issue.issue_text === req.query.issue_text : true;
          let condition_created_by = req.query.created_by ? issue.created_by === req.query.created_by : true;
          let condition_assigned_to = req.query.assigned_to ? issue.assigned_to === req.query.assigned_to : true;
          let condition_status_text = req.query.status_text ? issue.status_text === req.query.status_text : true;
          return condition_id && condition_issue_title && condition_issue_text && condition_created_by && condition_assigned_to && condition_status_text;
        });
        res.json(filtered_data);
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: "required field(s) missing" });
      } else {
        let newIssue = new issueModel({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          open: true,
          status_text: req.body.status_text || "",
        });
        projectModel.findOne({ name: project }, (err, oldProject) => {
          if (err) console.log("err while trying findOne() operation", err);
          if (!oldProject) {
            let newProject = new projectModel({ name: project });
            newProject.issues.push(newIssue);
            newProject.save((err, data) => {
              if (err) {
                res.send("Post operation: failed");
              } else {
                res.json(newIssue);
              }
            });
          } else {
            oldProject.issues.push(newIssue);
            oldProject.save((err, data) => {
              if (err) {
                res.send("Post operation: failed");
              } else {
                res.json(newIssue);
              }
            });
          }
        });
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.json({ error: "missing _id" });
      if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text) return res.json({ error: "no update field(s) sent", _id: req.body._id });
      projectModel.findOne({ name: project }, (err, projectData) => {
        if (err) return res.json({ error: "could not update", _id: req.body._id });
        let updatedData = projectData.issues.id(req.body._id);
        if (!updatedData) return res.json({ error: "could not update", _id: req.body._id });
        updatedData.issue_title = req.body.issue_title || updatedData.issue_title;
        updatedData.issue_text = req.body.issue_text || updatedData.issue_text;
        updatedData.created_by = req.body.created_by || updatedData.created_by;
        updatedData.assigned_to = req.body.assigned_to || updatedData.assigned_to;
        updatedData.status_text = req.body.status_text || updatedData.status_text;
        updatedData.updated_on = new Date();
        projectData.save((err, data) => {
          if (err) return res.json({ error: "could not update", _id: req.body._id });
          res.json({ result: "successfully updated", _id: req.body._id });
        });
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.json({ error: "missing _id" });
      projectModel.findOne({ name: project }, (err, projectData) => {
        if (err) return res.json({ error: "could not delete", _id: req.body._id });
        let deletedIssue = projectData.issues.id(req.body._id);
        if (!deletedIssue) return res.json({ error: "could not delete", _id: req.body._id });
        deletedIssue.remove();
        projectData.save((err, data) => {
          if (err) return res.json({ error: "could not delete", _id: req.body._id });
          res.json({ result: "successfully deleted", _id: req.body._id });
        });
      });
    });
};
