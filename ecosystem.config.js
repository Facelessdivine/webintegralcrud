module.exports = {
  apps : [{
    name   : "backend",
    script : "src/index.js",
    env: {
      NODE_ENV: "production",
      MONGODB_URI: 'mongodb+srv://MediaBookBuenas:Lh3lTQnb9oPxcvRm@cluster0.cvmem.mongodb.net/mediabook1',
      PORT: 5000,
      MONGODB: 'mediabook1',
      SECRET_KEY: '739d1c1c-d6c0-11eb-b8bc-0242ac130003'
    }
  }]
}
  