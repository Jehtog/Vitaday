/**
 * VITADAY — letter of intent emails.
 *
 * Deployed as a web app. The Supabase database POSTs one JSON body here each
 * time a row lands in letters_of_intent. This sends two emails:
 *   1. a confirmation to the person who signed
 *   2. an alert to the team (this same Gmail account)
 *
 * Nothing here is a purchase. VITADAY is not on sale, so the wording must stay
 * non-binding: no delivery dates, no discounts, no health claims.
 */

// Must match the token stored in the database. Treat it like a password.
const SHARED_TOKEN = 'PASTE_TOKEN_HERE';

// Where the team alert goes. Leave as '' to send it to this Gmail account.
const TEAM_EMAIL = 'vitaday.clsbe@gmail.com';

function doPost(e) {
  var NL = String.fromCharCode(10);
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.token !== SHARED_TOKEN) {
      return json({ ok: false, error: 'bad token' });
    }

    const name = String(body.name || '').trim() || 'there';
    const email = String(body.email || '').trim();
    const reference = String(body.reference || '').trim() || 'not assigned';
    const subscription = body.subscription === true;
    const amountCents = Number(body.amount_cents || 0);
    const items = Array.isArray(body.items) ? body.items : [];

    var at = email.indexOf('@');
    var dot = email.lastIndexOf('.');
    if (at < 1 || dot < at + 2 || dot > email.length - 3 || email.indexOf(' ') !== -1) {
      return json({ ok: false, error: 'bad email' });
    }

    const lines = items.length
      ? items.map(function (i) { return '  ' + (i.qty || 1) + ' x ' + (i.product || 'item'); }).join(NL)
      : '  (not recorded)';
    const total = '€' + (amountCents / 100).toFixed(2).replace('.', ',');

    // ---- 1. confirmation to the signer -------------------------------------
    const signerBody = [
      'Hi ' + name + ',',
      '',
      'Thanks for reserving a VITADAY. Your letter of intent is recorded.',
      '',
      'Reference: ' + reference,
      '',
      'What you reserved:',
      lines,
      'Indicative total: ' + total,
      subscription ? 'This includes the monthly refill subscription.' : '',
      '',
      'Please read this part, it matters:',
      '',
      'This is a letter of intent, not a purchase. Nothing has been charged and',
      'nothing is being shipped. VITADAY is not on sale yet.',
      '',
      'It is non-binding. You can withdraw at any time by replying to this email',
      'and saying so. You do not need to give a reason.',
      '',
      'We will contact you before launch with final pricing and timing. Both may',
      'change between now and then.',
      '',
      'Thanks for backing us this early.',
      '',
      'The VITADAY team',
      'Católica Lisbon School of Business and Economics',
    ].filter(function (l) { return l !== ''; }).join(NL);

    MailApp.sendEmail({
      to: email,
      subject: 'Your VITADAY reservation — ' + reference,
      body: signerBody,
      name: 'VITADAY',
    });

    // ---- 2. alert to the team ----------------------------------------------
    const teamTo = TEAM_EMAIL || Session.getEffectiveUser().getEmail();
    MailApp.sendEmail({
      to: teamTo,
      subject: 'New VITADAY letter of intent — ' + name,
      body: [
        'Name:      ' + name,
        'Email:     ' + email,
        'Reference: ' + reference,
        'Items:',
        lines,
        'Total:     ' + total,
        'Monthly:   ' + (subscription ? 'yes' : 'no'),
        'Signed at: ' + (body.created_at || new Date().toISOString()),
      ].join(NL),
      name: 'VITADAY',
    });

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
