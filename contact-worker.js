// Cloudflare Worker for contact form
// Deploy at https://dash.cloudflare.com/ -> Workers & Pages -> Create Worker
// Set env vars: EMAIL_TO (your email), EMAIL_API_KEY (SendGrid/Mailgun key)
// Form action: https://your-worker.your-subdomain.workers.dev

addEventListener('fetch', function (event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    var formData = await request.formData();
    var name = formData.get('name') || '';
    var email = formData.get('_replyto') || '';
    var message = formData.get('message') || '';

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Forward via email API (replace with SendGrid/Mailgun/etc.)
    var emailBody = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;

    // Example: SendGrid v3 API
    if (EMAIL_API_KEY && EMAIL_TO) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + EMAIL_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: EMAIL_TO }] }],
          from: { email: 'noreply@your-domain.com', name: 'Portfolio Contact' },
          subject: 'Portfolio message from ' + name,
          content: [{ type: 'text/plain', value: emailBody }]
        })
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
