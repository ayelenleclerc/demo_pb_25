const env = require("../env.config");

module.exports = {
  mongodb: {
    connectTo: (database) =>
      `mongodb+srv://Ayelenleclerc:Yuskia13@backend.xrrgkdz.mongodb.net/${database}?retryWrites=true&w=majority`,
  },
  // Change here for your mongo atlas account's URI
};
