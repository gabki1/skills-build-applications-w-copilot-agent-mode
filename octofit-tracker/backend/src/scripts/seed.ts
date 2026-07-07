import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Ava Chen',
        email: 'ava.chen@example.com',
        role: 'captain',
        age: 29,
        goal: 'Run a half marathon',
      },
      {
        name: 'Marcus Lee',
        email: 'marcus.lee@example.com',
        role: 'member',
        age: 34,
        goal: 'Improve strength endurance',
      },
      {
        name: 'Nia Patel',
        email: 'nia.patel@example.com',
        role: 'member',
        age: 27,
        goal: 'Increase weekly mileage',
      },
    ]);

    await Team.insertMany([
      {
        name: 'River Runners',
        members: 8,
        goal: 'Half marathon prep',
        sport: 'Running',
      },
      {
        name: 'Peak Performers',
        members: 5,
        goal: 'Strength endurance',
        sport: 'Cross-training',
      },
    ]);

    await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'run',
        duration: '32 min',
        calories: 310,
        date: new Date('2026-07-01T06:30:00.000Z'),
      },
      {
        userId: users[1]._id,
        type: 'strength',
        duration: '45 min',
        calories: 240,
        date: new Date('2026-07-02T18:00:00.000Z'),
      },
      {
        userId: users[2]._id,
        type: 'bike',
        duration: '60 min',
        calories: 420,
        date: new Date('2026-07-03T07:15:00.000Z'),
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        userId: users[0]._id,
        name: 'Ava Chen',
        points: 1250,
        streak: 8,
      },
      {
        userId: users[1]._id,
        name: 'Marcus Lee',
        points: 1180,
        streak: 5,
      },
      {
        userId: users[2]._id,
        name: 'Nia Patel',
        points: 1125,
        streak: 6,
      },
    ]);

    await Workout.insertMany([
      {
        title: 'Tempo Run',
        difficulty: 'Intermediate',
        duration: '35 min',
        focus: 'Speed endurance',
        equipment: ['running shoes'],
      },
      {
        title: 'Core Circuit',
        difficulty: 'Beginner',
        duration: '20 min',
        focus: 'Core strength',
        equipment: ['mat'],
      },
      {
        title: 'Hill Intervals',
        difficulty: 'Advanced',
        duration: '45 min',
        focus: 'Power and stamina',
        equipment: ['running shoes'],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
