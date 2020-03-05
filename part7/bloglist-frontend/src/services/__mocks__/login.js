import testHelper from "../../helpers/testHelper";

const returnedUser = testHelper.validLoggedInUser;

const login = async () => {
  return Promise.resolve(returnedUser);
};

export default { login };
