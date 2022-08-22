const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const User = require("./models/user.model");
const Company = require("./models/company.model");
const Job = require("./models/job.model");
//middelwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Initialize the connection to the mongoDB
 */
mongoose.connect(dbConfig.DB_URI);
const db = mongoose.connection;
db.on("error", () => {
  console.log("Error while connecting to MongoDB");
});
db.once("open", () => {
  console.log("Connected to mongoDB");
  init();
});

/**
 * Create the ADMIN user at the boot time
 */
async function init() {
  try {
    await User.collection.drop();
    await Job.collection.drop();
    await Company.collection.drop();

    const adminUser = await User.create({
      name: "admin",
      userId: "admin",
      password: bcrypt.hashSync("Welcome1", 8),
      email: "admin@email.com",
      userType: "ADMIN",
    });

    const company = await Company.create({
      name: "XYZ Company",
      address: "xyz address",
      verified: "APPROVED",
    });

    console.log(adminUser);
    console.log(company);

    const studentUser = await User.create({
      name: "student",
      userId: "student",
      password: bcrypt.hashSync("Welcome1", 8),
      email: "student@email.com",
      userType: "STUDENT",
    });
    console.log(studentUser);

    //find the company id and and then create a hr of that company
    const hrUser = await User.create({
      name: "hr",
      userId: "hr",
      password: bcrypt.hashSync("Welcome1", 8),
      email: "hr@email.com",
      companyId: company._id,
      userType: "HR",
      userStatus: "APPROVED", //approved for testing
    });
    console.log(hrUser);

    //now place the hr in the company too
    company.hr.push(hrUser._id);
    await company.save(); //save it in db

    console.log("after saving company", company);
    //now the hrUser can post a job
    const job = await Job.create({
      title: "Job",
      description: "Description",
      company: company._id, //usually it will be picked by login user company
      postedBy: hrUser._id,
    });
    console.log(job);
    //now update the company jobposted
    company.jobsPosted.push(job._id);
    await company.save(); //save it in db
    console.log("Company After", company);

    //student applying a job
    job.students.push(studentUser._id);
    await job.save();
    //also update the studentUser
    studentUser.jobsApplied.push(job._id);
    console.log("After", job);
    console.log("After", studentUser);
  } catch (err) {
    console.log("err in db initialization , " + err);
  }
}

app.listen(serverConfig.PORT, () => {
  console.log("Started the server on the PORT number : ", serverConfig.PORT);
});
