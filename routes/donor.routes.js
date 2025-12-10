const express = require('express')
const router = express.Router()
const {getSignUp, getSignIn, postSignUp, postSignIn, getAllDonors, getActiveCampaigns, getCampaignById, donateToCampaign, getDonorDonationHistory} = require('../controllers/donor.controllers')

router.get('/signup', getSignUp)
router.get('/signin', getSignIn)
router.post('/signup', postSignUp)
router.post('/signin', postSignIn)
router.get('/all', getAllDonors)
router.get('/campaigns/active', getActiveCampaigns)
router.get('/campaigns/:campaignId', getCampaignById)
router.post('/campaigns/:campaignId/donate', donateToCampaign)
router.get('/:donorId/donation-history', getDonorDonationHistory)

module.exports = router
