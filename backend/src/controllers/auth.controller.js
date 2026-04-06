import authService from '../services/auth.service.js';

export const signup = async (req, res) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ success: true, message: 'User created successfully', data: { user, token } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};