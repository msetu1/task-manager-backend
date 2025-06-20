import mongoose from 'mongoose';
import app from './app';
import dbConfig from './config/db.config';
async function service() {
  try {
    await mongoose.connect(dbConfig.database_Url as string);
    app.listen(dbConfig.port, () => {
      console.log(`Server is running on port ${dbConfig.port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

service();
