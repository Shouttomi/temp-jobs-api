const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getallJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  const job = await Job.findOne({ _id: id, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`no jobs with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  console.log(req.body);
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position cannot be empty");
  }
  //now finding the job, what we want to update
  const job = await Job.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if(!job){
    throw new NotFoundError(`No job with id ${id}`)
  }
  res.status(StatusCodes.OK).json({job})
};

const deleteJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id },
  } = req;

  const job = await Job.findOneAndRemove({
    _id:id,
    createdBy:userId
  })

  if(!job){
    throw new NotFoundError(`No job with id ${id}`)
  }
  res.status(StatusCodes.OK).json({job})


};

module.exports = {
  getallJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
