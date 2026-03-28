const mongoose = require('mongoose');

async function migrate() {
  let localConn, atlasConn;
  
  try {
    console.log('Starting full data migration...\n');
    
    // Connect to local DB
    console.log('🔗 Connecting to local MongoDB...');
    localConn = await mongoose.connect('mongodb://localhost:27017/tadkedar-restaurant');
    const localDb = localConn.connection.db;
    
    // Get all collections
    const collections = await localDb.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collections\n`);
    
    // Connect to Atlas
    console.log('🔗 Connecting to MongoDB Atlas...');
    atlasConn = await mongoose.createConnection('mongodb+srv://kartikgangavati2004_db_user:r04LZrebEY71Zkmm@tadkedardb.eehlnk5.mongodb.net/?appName=Tadkedardb');
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      atlasConn.once('connected', resolve);
      atlasConn.once('error', reject);
      setTimeout(() => reject(new Error('Connection timeout')), 15000);
    });
    console.log('✓ Connected to Atlas\n');
    
    const atlasDb = atlasConn.db;
    
    // Copy each collection
    console.log('📊 Migrating collections:\n');
    for (const col of collections) {
      try {
        // Get all documents
        const data = await localDb.collection(col.name).find({}).toArray();
        
        if (data.length === 0) {
          console.log(`  ⊘ ${col.name.padEnd(20)} - empty (0 documents)`);
          continue;
        }
        
        // Clear existing data in Atlas (optional, comment out to append)
        await atlasDb.collection(col.name).deleteMany({});
        
        // Insert in batches to avoid memory issues
        const batchSize = 1000;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          await atlasDb.collection(col.name).insertMany(batch);
        }
        
        console.log(`  ✅ ${col.name.padEnd(20)} - migrated ${data.length} documents`);
      } catch (err) {
        console.log(`  ❌ ${col.name.padEnd(20)} - ERROR: ${err.message}`);
      }
    }
    
    console.log('\n✅ Migration complete!');
    
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
  } finally {
    // Close connections
    if (localConn) await localConn.disconnect();
    if (atlasConn) await atlasConn.close();
    process.exit(0);
  }
}

migrate();
