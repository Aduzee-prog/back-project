const express = require("express")
const router = express.Router()
const {postNGOSignUp, postNGOSignIn, getNGOs, createCampaign, getNGOCampaigns} = require("../controllers/ngo.controllers")

router.post("/signup", postNGOSignUp)
router.post("/signin", postNGOSignIn)
router.get("/all", getNGOs)
router.post("/:ngoId/campaigns/create", createCampaign)
router.get("/:ngoId/campaigns", getNGOCampaigns)

module.exports = router
