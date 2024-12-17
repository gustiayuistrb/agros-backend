const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { ProfileUpdate } = require('../models/ProfileUpdate');

// Mendapatkan semua pengguna
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'Customer' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya Customer dan Super Admin yang dapat melihat pengguna.' });
    }

    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// Mendapatkan profil pengguna
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      city: user.city,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profil pengguna
const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { fullName, city, password } = req.body;
  const loggedInUserId = req.user.id;

  try {
    if (loggedInUserId !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const changes = [];

    if (fullName && user.fullName !== fullName) {
      changes.push({ field_updated: 'fullName', old_value: user.fullName, new_value: fullName });
      user.fullName = fullName;
    }

    if (city && user.city !== city) {
      changes.push({ field_updated: 'city', old_value: user.city, new_value: city });
      user.city = city;
    }

    if (req.body.email) {
      return res.status(400).json({ message: 'Email cannot be changed' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    for (const change of changes) {
      await ProfileUpdate.create({ user_id: userId, field_updated: change.field_updated, old_value: change.old_value, new_value: change.new_value });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: { id: user.id, fullName: user.fullName, city: user.city, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Menghapus pengguna
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Access denied. Only Super Admin can delete users.' });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await ProfileUpdate.destroy({ where: { user_id: userId } });
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers, getUserProfile, updateUserProfile, deleteUser };
