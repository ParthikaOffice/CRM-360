const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const {
  createLead,
  getAllLeads,
  deleteLead,
  updateLead,
  importLeads
} = require('../controllers/leadController');

router.post('/', createLead);

router.get('/', getAllLeads);

router.delete('/:id', deleteLead);

router.put('/:id', updateLead);

router.post('/import', upload.single('file'), importLeads);

module.exports = router;