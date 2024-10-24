### Architecture

Suggested architecture could be found in [here](./architecture/architecture.md).

### Application

Application contains database layer which is located under `db` directory. I have chosen `sequelize` as ORM system.
Service layer is under `service` directory. Each service communicates only with his own entity. In case some service
requires the data from another entity, only the service is called, not the database layer directly.

### How to run the application

Install dependencies: `npm ci`

Run tests: `npm test`

Run the application: `npm start`

To generate small amount of data you need to add environment variable `CREATE_SOME_DATA=true`, otherwise, the
database will be empty.

### Environment

node: v20.17.0
npm: 10.8.2
