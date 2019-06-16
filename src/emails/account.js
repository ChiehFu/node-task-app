const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jeff840107@gmail.com',
        subject: 'Thanks for joining in!',
        text: `welcome to the app, ${name}. Let me konw how you get along with the app.`
    })
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jeff840107@gmail.com',
        subject: 'Byebye！',
        text: `byebye!, ${name}.`
    })
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}