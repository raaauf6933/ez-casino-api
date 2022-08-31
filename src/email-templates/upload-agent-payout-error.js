const { SendEmail } = require("./../utils/sendEmail");
const db = require("./../../models");
const Users = db.users;

const UploadAgentPayoutError = async (name, error, message, user) => {
  const result = await Users.findAll({
    where: {
      club_id: user.club_id,
    },
  });

  const emailReceipient = result.map((e) => e.toJSON().email);

  const template = `
    <html>
    <body>
    <p>Hi ${name},</p>
    <p>Unfortunately, The last uploaded agent payout has an error</p>

    <p>Below is the Details: </p>
    <ul style="list-style-type:none;padding-left:0">
    <li>Error : ${error}</li>
    <li>Message : ${message}</li>
 
  </ul>

    </body>
    </html>
    `;

  await SendEmail({
    html: template,
    to: emailReceipient,
  });
};

module.exports = UploadAgentPayoutError;
