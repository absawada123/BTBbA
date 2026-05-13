// backend/src/database/migrate.js

const { initSchema } = require('./schema');
const { seedAdmin }  = require('./seed');

async function migrate() {
    initSchema();
    await seedAdmin();
    console.log('🌸 Migration complete.');
    process.exit(0);
}

migrate().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});