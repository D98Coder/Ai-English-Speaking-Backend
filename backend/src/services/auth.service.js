import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  async signup(userData) {
    const { name, email, password, englishLevel } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    const user = await User.create({ name, email, password, englishLevel });
    const token = this.generateToken(user._id);
    
    const userObject = user.toObject();
    delete userObject.password;
    
    return { user: userObject, token };
  }
  
  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    const token = this.generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    
    return { user: userObject, token };
  }
}

export default new AuthService();