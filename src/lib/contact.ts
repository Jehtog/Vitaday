/**
 * Single place for the address people can use to reach the team about their data.
 * This is also the address the WhatsApp bot's privacy notice uses, so the two match.
 * Change it here and every form, the privacy policy and the unsubscribe wording follow.
 */
export const PRIVACY_EMAIL = "s-jgerges@ucp.pt";
export const privacyMailto = (subject: string) => `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent(subject)}`;
