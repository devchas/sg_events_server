import express from 'express';
import createEvent from './schema/createEvent';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import schema from './schema/schema';
import cors from 'cors';

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.post('/event', createEvent);

var server = app.listen(4000, () => {
  console.log('Listening on port 4000');
});

export default server;
