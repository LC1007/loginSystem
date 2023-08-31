const db = require('../config')

class User {
  static async createUser(user) {
    try {
      const [result] = await db.query("INSERT INTO Users SET ?", [user]);
      return result.insertId;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  }

  static async findUserByEmail(emailAdd) {
    try {
        console.log("Trying to find user with email:", emailAdd);

      const query = `SELECT userID, firstName, lastName, gender, userDOB, emailAdd, userPass, profileUrl, userRole FROM Users WHERE emailAdd = ?`;
      const [rows] = await db.query(query, [emailAdd]);

      console.log("User found:", rows[0]);
      return rows[0];
    } catch (error) {
      console.error("Error in findUserByEmail:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  }
}

module.exports = User