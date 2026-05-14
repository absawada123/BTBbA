require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌸 BTBbyA Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;