"use strict";

const issueModel = require("../mongo_db/mongo_models").issue;
const projectModel = require("../mongo_db/mongo_models").project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
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
          console.log("we are in projectModel");
          if (!oldProject) {
            console.log("new projectModel");
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
            console.log("old projectModel");
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
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
