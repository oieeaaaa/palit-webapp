import sg from '@sendgrid/mail';

// configure sendgrid
sg.setApiKey(process.env.SEND_GRID_API_KEY);

/**
 * tradeRequestAccepted.
 * TODO: Setup api and improve this code
 * TODO: Use cloud-functions when you have enough money to pay ✌️
 *
 * @param {object} req
 * @param {object} res
 */
const tradeRequestAccepted = async (req, res) => {
  if (req.method !== 'POST') {
    res.send(false);
  }

  const {
    myItem,
    myContact,
    partnerItem,
    partnerContact,
  } = req.body;

  const messageToMyself = {
    to: myContact.email,
    from: process.env.SEND_GRID_SENDER_EMAIL,
    templateId: process.env.SEND_GRID_TEMPLATE_ID,
    dynamic_template_data: {
      subject: 'Item Accepted! 🎉',
      myItem,
      partnerItem,
      partnerContact,
    },
  };

  // IMPORTANT: Consider the partner's perspective to understand why I flipped the variables
  const messageToPartner = {
    to: partnerContact.email,
    from: process.env.SEND_GRID_SENDER_EMAIL,
    templateId: process.env.SEND_GRID_TEMPLATE_ID,
    dynamic_template_data: {
      subject: 'Item Accepted! 🎉',
      myItem: partnerItem,
      partnerItem: myItem,
      partnerContact: myContact,
    },
  };

  let isSuccess = false;

  try {
    await sg.send(messageToMyself);
    await sg.send(messageToPartner);

    isSuccess = true;
  } catch (err) {
    isSuccess = false;
  }

  res.send(isSuccess);
};

export default tradeRequestAccepted;
