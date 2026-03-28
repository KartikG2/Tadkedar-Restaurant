import app from './app';
import dotenv from 'dotenv';
import connectDB from './utils/mongodb';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to database', error);
});
