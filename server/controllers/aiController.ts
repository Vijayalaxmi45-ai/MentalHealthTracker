import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { analyzeMoodFromText } from '../openai';

export const getAiSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    const { mood, text } = req.query;
    
    let suggestion = '';
    
    if (text) {
        const analysis = await analyzeMoodFromText(text as string, (mood as string) || 'okay');
        suggestion = analysis.suggestions?.[0] || "Take a deep breath and stay positive.";
    } else {
        switch (mood) {
          case 'great':
          case 'Happy':
            suggestion = "It's a great day! Keep spreading the positivity. Why not reach out to a friend or try a new creative hobby?";
            break;
          case 'bad':
          case 'terrible':
          case 'Sad':
            suggestion = "It's okay to feel down sometimes. Be kind to yourself. A short walk, some light music, or a cup of warm tea might help.";
            break;
          case 'Angry':
            suggestion = "Take a deep breath. Try counting to ten. A quick meditation session or physical exercise could help release the tension.";
            break;
          case 'Anxious':
            suggestion = "Focus on the present moment. Try the 5-4-3-2-1 grounding technique. Remember, this feeling is temporary.";
            break;
          case 'Tired':
            suggestion = "Your body needs rest. Consider an early night or a quick 20-minute power nap. Don't push yourself too hard.";
            break;
          default:
            suggestion = "Take a moment for some self-care today. Consistency is key to maintaining your mental well-being.";
        }
    }

    res.status(200).json({ suggestion });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
