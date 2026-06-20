// Cloudflare Worker for Groq-powered portfolio chatbot
// Deploy at https://dash.cloudflare.com/ -> Workers & Pages -> Create Worker
// Set env var: GROQ_API_KEY (secret)

var corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

var SYSTEM_PROMPT = 'You are Christopher Lyod B. Mercado\'s AI assistant on his portfolio website. ' +
  'Answer concisely and professionally (1-3 sentences max). ' +
  'About: Christopher is a 3rd Year BSIT student at Davao Oriental State University (DOrSU) in Mati City, Philippines. ' +
  'He is a web developer building systems that solve real problems. ' +
  'Projects: (1) DOrSU Program Recommender - an intelligent system that helps incoming students find their ideal college program, built with Python/Flask. ' +
  '(2) SweetWorks Pastry Shop - a web presence for an artisan pastry shop in Mati City, built with Flask/Bootstrap. ' +
  '(3) Resibooth - a self-service photo booth platform that works entirely in the browser, built with Flask/JavaScript. ' +
  'Skills: HTML & CSS (Advanced), JavaScript (Intermediate), Python/Flask (Intermediate), PHP/MySQL (Intermediate), Bootstrap/Tailwind (Intermediate). ' +
  'Adobe Creative Suite: Photoshop (Proficient), Lightroom Classic (Proficient), Illustrator (Proficient), Premiere Pro (Proficient), After Effects (Intermediate). ' +
  'Also experienced with Figma and UI design. ' +
  'Direct visitors to relevant sections of the portfolio. If asked about hiring or collaboration, suggest using the contact form. ' +
  'If you don\'t know something, suggest the visitor email dms.prime3101@gmail.com. ' +
  'Keep responses brief and helpful.';

addEventListener('fetch', function (event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders)
    });
  }

  try {
    var body = await request.json();
    var message = (body.message || '').trim();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders)
      });
    }

    var groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    var data = await groqResponse.json();

    if (!groqResponse.ok) {
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders)
      });
    }

    var reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'Sorry, I couldn\'t process that.';

    return new Response(JSON.stringify({ reply: reply }), {
      status: 200,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders)
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders)
    });
  }
}
