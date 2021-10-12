const application = require('./application');
const database = require('./database');

const serverPort = process.env.SERVER_PORT || 3333;

async function main () {
  await database.connect();
  application.listen(serverPort, () => console.log(`Server running on *:${serverPort}`));
}

main();

