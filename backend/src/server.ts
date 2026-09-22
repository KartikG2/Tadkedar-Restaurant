import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './utils/mongodb';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to database', error);
});
