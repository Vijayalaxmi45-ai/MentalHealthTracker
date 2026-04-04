import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_mindtune';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = await createUser(name, email, passwordHash);
    
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: { id: userId, name, email } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req: Request & { user?: any }, res: Response) => {
    try {
        const user = await findUserByEmail(req.user.email);
        if(!user) return res.status(404).json({message: "User not found"});
        res.status(200).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
