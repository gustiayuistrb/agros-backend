const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Impor controller
const authenticateJWT = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/', authenticateJWT, userController.getAllUsers);
router.get('/profile', authenticateJWT, userController.getUserProfile);
router.put('/update/:id', authenticateJWT, userController.updateUserProfile);
router.delete('/delete/:userId', authenticateJWT, userController.deleteUser);

module.exports = router;
