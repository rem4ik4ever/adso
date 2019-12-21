const allUsers = {
  name: "all_users",
  create: true,
  update: true,
  params: {
    source: "users"
  }
};

const userByConfirmationToken = {
  name: "user_by_confirmation_token",
  create: true,
  update: true,
  params: {
    source: "users",
    unique: true,
    serialized: true,
    source: "users",
    terms: [
      {
        field: ["data", "confirmationToken"]
      }
    ]
  }
};

const userByEmail = {
  name: "user_by_email",
  create: true,
  update: true,
  params: {
    source: "users",
    unique: true,
    serialized: true,
    source: "users",
    terms: [
      {
        field: ["data", "email"]
      }
    ]
  }
};

const userByUuid = {
  name: "user_by_uuid",
  create: true,
  update: true,
  params: {
    source: "users",
    unique: true,
    serialized: true,
    source: "users",
    terms: [
      {
        field: ["data", "uuid"]
      }
    ]
  }
};

module.exports = [allUsers, userByConfirmationToken, userByEmail, userByUuid];
