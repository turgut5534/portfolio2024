const Visitor = require('../models/data');
const useragent = require('useragent');
const geoip = require('geoip-lite');
const requestIp = require('request-ip');

const visitorInfoMiddleware = async (req, res, next) => {
  try {
    const ip = req.clientIp;  // Get the real IP address using request-ip
    const geo = geoip.lookup(ip);
    const country = geo ? geo.country : 'Unknown';
    const city = geo ? geo.city : 'Unknown';

    // Parse the User-Agent string
    const agent = useragent.parse(req.headers['user-agent']);
    const device = agent.device.family;
    const os = agent.os.family;
    const browser = agent.toAgent();
    const language = req.headers['accept-language'];

    const timestamp = new Date().toISOString();
    const referrer = req.get('Referer');

    // Get UTM source from URL if available
    const urlParams = new URLSearchParams(req.url);
    const utmSource = urlParams.get('utm_source') || 'unknown';

    // Save the data to the database
    await Visitor.create({
      ip,
      country,
      city,
      device,
      os,
      browser,
      language,
      timestamp,
      referrer,
      utmSource,
    });

    // Log visitor info (optional)
    console.log(`Visitor Info: IP: ${ip}, Country: ${country}, Device: ${device}, OS: ${os}, Browser: ${browser}`);

    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error('Error saving visitor info:', error);
    next(); // Still proceed even if there's an error
  }
};

module.exports = visitorInfoMiddleware;
