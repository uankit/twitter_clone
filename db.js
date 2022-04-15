const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(
        "mongodb+srv://tinderClone:tindercloneadmin@twitterclone.ofu2e.mongodb.net/twitterClone?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("Connection Successful");
      })
      .catch((e) => {
        console.log("Error Occurred");
      });
  }
}

module.exports = new Database();
