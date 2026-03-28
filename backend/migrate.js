const mongoose = require('mongoose');

async function migrate() {
  let localConn, atlasConn;
  
  try {
    console.log('Starting migration...');
    
    // Connect to local DB
    console.log('Connecting to local MongoDB...');
    localConn = await mongoose.connect('mongodb://localhost:27017/tadkedar-restaurant');
    const localDb = localConn.connection.db;
    
    // Get all collections
    const collections = await localDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections\n`);
    
    // Connect to Atlas
    console.log('Connecting to MongoDB Atlas...');
    atlasConn = await mongoose.createConnection('mongodb+srv://kartikgangavati2004_db_user:r04LZrebEY71Zkmm@tadkedardb.eehlnk5.mongodb.net/?appName=Tadkedardb');
    
    // Wait for connection to be ready
    await new Promise((resolve, reject) => {
      atlasConn.once('connected', resolve);
      atlasConn.once('error', reject);
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
    
    const atlasDb = atlasConn.db;
    
    // Copy each collection
    for (const col of collections) {
      const data = await localDb.collection(col.name).find({}).toArray();
      if (data.length > 0) {
        await atlasDb.collection(col.name).insertMany(data);
        console.log(`✅ Migrated ${col.name} (${data.length} documents)`);
      } else {
        console.log(`⊘ Skipped ${col.name} (empty collection)`);
      }
    }
    
    console.log('\n✅ Migration complete!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    // Close connections
    if (localConn) await localConn.disconnect();
    if (atlasConn) await atlasConn.close();
    process.exit(0);
  }
}

migrate();
