import express from 'express';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

const app = express();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.get(['/api/users', '/api/users/'], async (_req, res) => {
  const users = await User.find({}).lean();
  res.json({ data: users });
});

app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
  const teams = await Team.find({}).lean();
  res.json({ data: teams });
});

app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
  const activities = await Activity.find({}).populate('userId', 'name').lean();
  res.json({ data: activities });
});

app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find({}).lean();
  res.json({ data: leaderboard });
});

app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
  const workouts = await Workout.find({}).lean();
  res.json({ data: workouts });
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Backend listening on port ${port}`);
      console.log(`API base URL: ${apiBaseUrl}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  });
