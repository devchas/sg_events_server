import db from '../db';
import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(user) {
          return user.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(user) {
          return user.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        }
      },
      campaigns: {
        type: new GraphQLList(CampaignType),
        resolve(user) {
          return user.getCampaigns();
        }
      },
      events: {
        type: new GraphQLList(EventType),
        resolve(user) {
          return user.getEvents();
        }
      },
      campaignEvents: {
        type: new GraphQLList(EventType),
        args: { campaignId: { type: new GraphQLNonNull(GraphQLInt) } },
        resolve(user, args) {
          return db.models.event.findAll({ where: {
            userId: user.id,
            campaignId: args.campaignId
          }}).then(events => {
            return events;
          });
        }
      }
    }
  }
});

const CampaignType = new GraphQLObjectType({
  name: 'Campaign',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(campaign) {
          return campaign.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve(campaign) {
          return campaign.name;
        }
      },
      users: {
        type: new GraphQLList(UserType),
        resolve(campaign) {
          return campaign.getUsers();
        }
      },
      events: {
        type: new GraphQLList(EventType),
        resolve(campaign) {
          return campaign.getEvents();
        }
      },
      userEvents: {
        type: new GraphQLList(EventType),
        args: { userId: { type: GraphQLInt } },
        resolve(campaign, args) {
          return db.models.event.findAll({ where: {
            campaignId: campaign.id,
            userId: args.userId
          }}).then(events => {
            return events;
          });
        }
      }
    }
  }
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(event) {
          return event.id;
        }
      },
      eventType: {
        type: GraphQLString,
        resolve(event) {
          return event.eventType;
        }
      },
      timestamp: {
        type: GraphQLString,
        resolve(event) {
          return event.timestamp;
        }
      },
      url: {
        type: GraphQLString,
        resolve(event) {
          return event.url
        }
      },
      user: {
        type: UserType,
        resolve(event) {
          return event.getUser();
        }
      },
      campaign: {
        type: CampaignType,
        resolve(event) {
          return event.getCampaign();
        }
      }
    }
  }
});

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => {
    return {
      user: {
        type: UserType,
        args: { id: { type: GraphQLInt } },
        resolve(parentValue, args) {
          return db.models.user.findById(args.id);
        }
      },
      users: {
        type: new GraphQLList(UserType),
        args: { id: { type: GraphQLInt } },
        resolve(parentValue, args) {
          return db.models.user.findAll({ where: args });
        }
      },
      campaign: {
        type: CampaignType,
        args: { id: { type: GraphQLInt } },
        resolve(parentValue, args) {
          return db.models.campaign.findById(args.id);
        }
      },
      campaigns: {
        type: new GraphQLList(CampaignType),
        args: { id: { type: GraphQLInt } },
        resolve(parentValue, args) {
          return db.models.campaign.findAll({ where: args });
        }
      },      
      event: {
        type: EventType,
        args: { id: { type: GraphQLInt } },
        resolve(parentValue, args) {
          return db.models.event.findById(args.id);
        }
      },
      events: {
        type: new GraphQLList(EventType),
        args: { id: { type: GraphQLInt } },
        resolve(parentValue, args) {
          return db.models.event.findAll({ where: args });
        }
      },       
    }
  }
});