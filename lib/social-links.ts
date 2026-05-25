const EMAIL_ADDRESS = "shubhamedu.01@gmail.com";

const EMAIL_COMPOSE = {
  subject: "Portfolios don't usually make me email people",
  body: [
    "Shubham,",
    "",
    "I don't email people from portfolio sites often. Yours broke that streak.",
    "",
    "I'm [your name] — reaching out about:",
    "",
    "",
    "If you're up for a quick chat, I'm in. If not, no worries at all.",
    "",
    "Cheers,",
    "[your name]",
  ].join("\n"),
} as const;

function buildGmailComposeUrl(
  to: string,
  { subject, body }: { subject: string; body: string },
) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export const X_USERNAME = "10shubham01";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/shubhamgupta001/",
  github: "https://github.com/10shubham01",
  peerlist: `https://peerlist.io/${X_USERNAME}`,
  instagram: "https://www.instagram.com/m0re0fme/",
  resume: "/shubham-gupta.pdf",
  email: buildGmailComposeUrl(EMAIL_ADDRESS, EMAIL_COMPOSE),
} as const;
