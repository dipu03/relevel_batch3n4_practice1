//Job->title,description,companybelongTo,[studentsAppliedTojob],jobStatus,postedByHR(hrUserId)

const mongoose = require("mongoose");

const { jobStatus } = require("../utils/constants");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: jobStatus.active,
    },
    students: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
    },
    company: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Company",
    },
    postedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Job", jobSchema);
