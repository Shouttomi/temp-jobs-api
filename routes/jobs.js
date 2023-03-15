const express = require('express')
const router = express.Router()

const {
    getallJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
  } = require('../controllers/jobs')

router.route('/').post(createJob).get(getallJobs)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router