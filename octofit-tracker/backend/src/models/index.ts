import mongoose, { Schema } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  role: string;
  age: number;
  goal: string;
}

interface ITeam {
  name: string;
  members: number;
  goal: string;
  sport: string;
}

interface IActivity {
  userId: mongoose.Types.ObjectId;
  type: string;
  duration: string;
  calories: number;
  date: Date;
}

interface ILeaderboardEntry {
  userId: mongoose.Types.ObjectId;
  name: string;
  points: number;
  streak: number;
}

interface IWorkout {
  title: string;
  difficulty: string;
  duration: string;
  focus: string;
  equipment: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  age: { type: Number, required: true },
  goal: { type: String, required: true },
}, { timestamps: true });

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  members: { type: Number, required: true },
  goal: { type: String, required: true },
  sport: { type: String, required: true },
}, { timestamps: true });

const activitySchema = new Schema<IActivity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  points: { type: Number, required: true },
  streak: { type: Number, required: true },
}, { timestamps: true });

const workoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true },
  difficulty: { type: String, required: true },
  duration: { type: String, required: true },
  focus: { type: String, required: true },
  equipment: { type: [String], default: [] },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema, 'users');
export const Team = mongoose.model<ITeam>('Team', teamSchema, 'teams');
export const Activity = mongoose.model<IActivity>('Activity', activitySchema, 'activities');
export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema, 'leaderboard');
export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema, 'workouts');

export type { IUser, ITeam, IActivity, ILeaderboardEntry, IWorkout };
