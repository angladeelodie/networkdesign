const SETUP = {
  async preload(lvlsNumber) {
    let levels = {};

    for (let lvlNumber of lvlsNumber) {
      levels[lvlNumber] = await this.getLevel(lvlNumber);
    }

    return levels;
  },

  getLevel(number) {
    return new Promise((resolve, reject) => {
      // arrow functions
      // http://localhost:8080
      let directory = "../config/levels/";
      let file = `level_${number}.json`;

      fetch(directory + file)
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          resolve(json);
          //console.log(this.users);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
