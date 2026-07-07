"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_js_1 = require("./models/index.js");
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use(express_1.default.json());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (_req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', apiBaseUrl });
});
app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const users = await index_js_1.User.find({}).lean();
    res.json({ data: users });
});
app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const teams = await index_js_1.Team.find({}).lean();
    res.json({ data: teams });
});
app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const activities = await index_js_1.Activity.find({}).populate('userId', 'name').lean();
    res.json({ data: activities });
});
app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const leaderboard = await index_js_1.LeaderboardEntry.find({}).lean();
    res.json({ data: leaderboard });
});
app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const workouts = await index_js_1.Workout.find({}).lean();
    res.json({ data: workouts });
});
mongoose_1.default
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
