import { CONTACTS } from '../../config/contacts.mjs';

export { CONTACTS };

/** Spread contact URLs into mini-template render data. */
export function withContacts(data) {
  return {
    ...data,
    contactsEmail: CONTACTS.email,
    kakaoUrl: CONTACTS.kakao,
    whatsappUrl: CONTACTS.whatsapp,
  };
}
