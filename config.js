const config = {
    development: {
      host: "127.0.0.1",
      port: 3306, // Note: `port` is specified separately from `host`
      user: "root",
      password: "Fame4463",
      database: "ENIGMA",
    },
    production: {
      host: "enigma.com", // Example: "db.example.com"
      port: 3306, // Assuming default MySQL port, adjust if different
      user: "Fame",
      password: "12345678",
      database: "ENIGMA",
    },
  };
  
  module.exports = config;
  
