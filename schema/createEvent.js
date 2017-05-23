import db from '../db';

const createEvent = (req, res) => {
  req.body.map(event => {
    handleEmail(event.email, user => {
      handleCampaign(event.marketing_campaign_id, event.marketing_campaign_name, campaign => {
        campaign.addUser(user).then(() => {
          db.models.event.create({
            eventType: event.event,
            timestamp: event.timestamp,
            url: event.url,
            sgEventId: event.sg_event_id,
            sgMessageId: event.sg_message_id,
            userId: user.id,
            campaignId: campaign.id
          }).then(event => {
            res.send(event);
          });
        });
      });
    });
  });
};

function handleEmail(email, callback) {
  db.models.user.findOrCreate({ where: { email } })
    .spread((user, created) => {
      callback(user);
    });
}

function handleCampaign(sgId, name, callback) {
  db.models.campaign.findOrCreate({ where: { sgId }, defaults: { name } })
    .spread((campaign, created) => {
      callback(campaign);
    });
}

export default createEvent;