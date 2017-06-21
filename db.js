import Sequelize from 'sequelize';
import Faker from 'faker';

const Conn = new Sequelize('mailevents', 'devinchasanoff', 'password', {
  dialect: 'postgres',
  host: 'localhost'
});

const User = Conn.define('user', {
  email: { type: Sequelize.STRING, allowNull: false }
});

const Event = Conn.define('event', {
  eventType: { type: Sequelize.STRING, allowNull: false },
  timestamp: { type: Sequelize.DATE },
  url: { type: Sequelize.STRING },
  // category: { type: Sequelize.STRING },
  sgEventId: { type: Sequelize.STRING },
  sgMessageId: { type: Sequelize.STRING }
});

const Campaign = Conn.define('campaign', {
  name: { type: Sequelize.STRING },
  sgId: { type: Sequelize.INTEGER }
});

User.belongsToMany(Campaign, { through: 'userCampaign' });
User.hasMany(Event);

Campaign.belongsToMany(User, { through: 'userCampaign' });
Campaign.hasMany(Event);

Event.belongsTo(User);
Event.belongsTo(Campaign);

const populate = false;

if (process.env.NODE_ENV !== 'test' && populate) {
  Conn.sync({ force: true }).then(() => {
    User.create({ email: Faker.internet.email().toLowerCase() }).then(user => {
      Campaign.create({
        name: Faker.lorem.word() + ' Campaign',
        sgId: 12345
      }).then(campaign => {
        Event.create({
          eventType: 'deliver',
          timestamp: new Date(),
          url: Faker.internet.url(),
          userId: user.id,
          campaignId: campaign.id
        }).then(event => {
          campaign.addUser(user);
        });
      });
    });
  });
}

export default Conn;