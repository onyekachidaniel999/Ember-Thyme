export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { name, email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'No email provided' });

  const BREVO_KEY = process.env.BREVO_API_KEY;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Ember & Thyme', email: 'chronomystofficial@gmail.com' },
        to: [{ email, name: name || 'Valued Guest' }],
        subject: 'Your Reservation Request — Ember & Thyme',
        htmlContent: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#1c1c1c;color:#fffdf7;border-radius:12px;overflow:hidden;">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#8B0000,#c0392b);padding:40px 36px;text-align:center;">
              <div style="font-size:11px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,253,247,0.7);margin-bottom:10px;">Fine Dining Experience</div>
              <h1 style="margin:0;font-size:32px;font-weight:700;color:#f39c12;letter-spacing:2px;">Ember & Thyme</h1>
              <div style="width:40px;height:1px;background:#f39c12;margin:16px auto;"></div>
              <p style="margin:0;font-size:13px;color:rgba(255,253,247,0.75);letter-spacing:1px;">Toronto, Canada</p>
            </div>

            <!-- Body -->
            <div style="padding:40px 36px;">
              <p style="font-size:16px;margin-top:0;">Dear <strong style="color:#f39c12;">${name || 'Valued Guest'}</strong>,</p>
              <p style="font-size:15px;line-height:1.8;color:rgba(255,253,247,0.85);">
                Thank you for reaching out to <strong>Ember & Thyme</strong>. We've received your reservation request and our team will get back to you within <strong style="color:#f39c12;">6 hours</strong> to confirm your booking.
              </p>
              <p style="font-size:15px;line-height:1.8;color:rgba(255,253,247,0.85);">
                We look forward to welcoming you to an unforgettable dining experience — where every flame tells a story and every dish is crafted with passion.
              </p>

              <!-- Urgent CTA -->
              <div style="background:rgba(255,255,255,0.05);border-left:3px solid #f39c12;padding:20px 24px;margin:28px 0;border-radius:0 8px 8px 0;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#f39c12;">Need an urgent reservation?</p>
                <p style="margin:0;font-size:14px;color:rgba(255,253,247,0.8);">Call us directly and we'll assist you right away:</p>
                <a href="tel:+14165550192" style="display:inline-block;margin-top:12px;background:#c0392b;color:#fff;padding:12px 24px;text-decoration:none;font-size:15px;font-weight:700;border-radius:4px;letter-spacing:1px;">
                  📞 +1 (416) 555 0192
                </a>
              </div>

              <p style="font-size:14px;line-height:1.8;color:rgba(255,253,247,0.6);">
                We kindly ask that you arrive on time for your reservation. Late arrivals beyond 15 minutes may result in the table being released.
              </p>
            </div>

            <!-- Footer -->
            <div style="background:rgba(0,0,0,0.3);padding:24px 36px;text-align:center;border-top:1px solid rgba(243,156,18,0.15);">
              <p style="margin:0 0 6px;font-size:13px;color:#f39c12;letter-spacing:2px;text-transform:uppercase;">Ember & Thyme</p>
              <p style="margin:0;font-size:12px;color:rgba(255,253,247,0.4);">Every meal is a memory in the making.</p>
            </div>

          </div>
        `
      })
    });

    const data = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, error: data });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
