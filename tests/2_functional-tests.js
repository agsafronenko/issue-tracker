const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let id_to_delete = "";
  suite("POST requests to /api/issues/project", function () {
    test("Create an issue with every field: POST request to /api/issues/project", function (done) {
      chai
        .request(server)
        .post("/api/issues/projects")
        .send({
          issue_title: "Powder with leather pants",
          issue_text: "Critical failure while mixing powder with leather pants",
          created_by: "Ross Geller",
          assigned_to: "Screenwriter",
          status_text: "Immediate assisstance required",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.issue_title, "Powder with leather pants");
          assert.equal(res.body.issue_text, "Critical failure while mixing powder with leather pants");
          assert.equal(res.body.created_by, "Ross Geller");
          assert.equal(res.body.assigned_to, "Screenwriter");
          assert.equal(res.body.status_text, "Immediate assisstance required");
          id_to_delete = res.body._id;
          done();
        });
    });
    test("Create an issue with only required fields: POST request to /api/issues/project", function (done) {
      chai
        .request(server)
        .post("/api/issues/projects")
        .send({
          issue_title: "Powder with leather pants",
          issue_text: "Critical failure while mixing powder with leather pants",
          created_by: "Ross Geller",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.issue_title, "Powder with leather pants");
          assert.equal(res.body.issue_text, "Critical failure while mixing powder with leather pants");
          assert.equal(res.body.created_by, "Ross Geller");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });
    test("Create an issue with missing required fields: POST request to /api/issues/project", function (done) {
      chai
        .request(server)
        .post("/api/issues/projects")
        .send({
          issue_title: "Powder with leather pants",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });
  suite("GET requests to /api/issues/project_2", function () {
    test("View issues on a project: GET request to /api/issues/project_2", function (done) {
      chai
        .request(server)
        .get("/api/issues/projects_2")
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.length, 2);
          done();
        });
    });
    test("View issues on a project with one filter: GET request to /api/issues/project_2", function (done) {
      chai
        .request(server)
        .get("/api/issues/projects_2?created_by=Ross%20Geller")
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.length, 2);
          assert.equal(res.body[0].created_by, "Ross Geller");
          assert.equal(res.body[1].created_by, "Ross Geller");
          done();
        });
    });
    test("View issues on a project with multiple filters: GET request to /api/issues/project_2", function (done) {
      chai
        .request(server)
        .get("/api/issues/projects_2?created_by=Ross%20Geller&assigned_to=Screenwriter")
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].issue_title, "Powder with leather pants");
          assert.equal(res.body[0].issue_text, "Critical failure while mixing powder with leather pants");
          assert.equal(res.body[0].created_by, "Ross Geller");
          assert.equal(res.body[0].assigned_to, "Screenwriter");
          assert.equal(res.body[0].status_text, "Immediate assisstance required");
          done();
        });
    });
  });
  suite("PUT requests to /api/issues/project_3", function () {
    test("Update one field on an issue: PUT request to /api/issues/project_3", function (done) {
      chai
        .request(server)
        .put("/api/issues/projects_3")
        .send({
          _id: "64dcc8e0ae50b135d4da1142",
          issue_text: "Critical failure while mixing powder with leather pants. Edit: this happened on a date: change critical failure to EPIC failure",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "64dcc8e0ae50b135d4da1142");
          done();
        });
    });
    test("Update multiple fields on an issue: PUT request to /api/issues/project_3", function (done) {
      chai
        .request(server)
        .put("/api/issues/projects_3")
        .send({
          _id: "64dcc8e0ae50b135d4da1142",
          issue_text: "Critical failure while mixing powder with leather pants. Edit: this happened on a date: change critical failure to EPIC failure",
          assigned_to: "Producer",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "64dcc8e0ae50b135d4da1142");
          done();
        });
    });
    test("Update an issue with missing _id: PUT request to /api/issues/project_3", function (done) {
      chai
        .request(server)
        .put("/api/issues/projects_3")
        .send({
          issue_text: "Critical failure while mixing powder with leather pants. Edit: this happened on a date: change critical failure to EPIC failure",
          assigned_to: "Producer",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("Update an issue with no fields to update: PUT request to /api/issues/project_3", function (done) {
      chai
        .request(server)
        .put("/api/issues/projects_3")
        .send({
          _id: "64dcc8e0ae50b135d4da1142",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });
    test("Update an issue with an invalid _id: PUT request to /api/issues/project_3", function (done) {
      chai
        .request(server)
        .put("/api/issues/projects_3")
        .send({
          _id: "----ROSS-----GELLER------",
          assigned_to: "Producer",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });
  suite("DELETE requests to /api/issues/project", function () {
    test("Delete an issue: DELETE request to /api/issues/project", function (done) {
      chai
        .request(server)
        .delete("/api/issues/projects")
        .send({
          _id: id_to_delete,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/project", function (done) {
      chai
        .request(server)
        .delete("/api/issues/projects")
        .send({
          _id: "----ROSS----GELLER-----",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.error, "could not delete");
          done();
        });
    });
  });
  test("Delete an issue with missing _id: DELETE request to /api/issues/project", function (done) {
    chai
      .request(server)
      .delete("/api/issues/projects")
      .send({
        _id: "",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
