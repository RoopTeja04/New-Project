const nodemailer = require("nodemailer");

const sendInviteMail = async ({
  email,
  companyName,
  designation,
  token,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const inviteLink = `http://localhost:5173/invite/${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,

    to: email,

    subject: `Invitation to join ${companyName}`,

    html: `
      <div style="font-family: Arial; padding: 20px;">

        <h2>Company Invitation</h2>

        <p>
          You have been invited to join
          <strong>${companyName}</strong>
        </p>

        <p>
          Designation: <strong>${designation}</strong>
        </p>

        <a
          href="${inviteLink}"
          style="
            background: black;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          "
        >
          Accept Invitation
        </a>

        <p style="margin-top:20px;">
          This invitation expires in 7 days.
        </p>

      </div>
    `,
  });
};

module.exports = sendInviteMail;
