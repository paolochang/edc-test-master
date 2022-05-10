import faker from "faker";

export default class Tester {
  constructor(request) {
    this.request = request;
    this.fakeUser = {
      ...faker.helpers.userCard(),
      password: faker.internet.password(10, true),
    };
  }

  getNewUserInfo() {
    const newTester = faker.helpers.userCard();
    return {
      name: newTester.name,
      username: newTester.username,
      email: newTester.email,
      password: faker.internet.password(10, true),
    };
  }

  getSignUpInfo() {
    return {
      name: this.fakeUser.name,
      username: this.fakeUser.username,
      email: this.fakeUser.email,
      password: this.fakeUser.password,
    };
  }

  async createNewAccount() {
    const newTester = this.getNewUserInfo();
    const res = await this.request.post("/auth/signup", newTester);
    return {
      ...newTester,
      jwt: res.data.token,
    };
  }

  async createNewTweet(text, token) {
    return await this.request.post(
      "/tweets",
      { text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
