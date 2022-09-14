const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const cf = require('cloudflare')({
  token: process.env.CLOUDFLARE_TOKEN
});

const getCachedIP = () => {  
  const cachePath = path.join(__dirname, '..', 'cache', 'public-ip.json');
  const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath)) : {};
  const currentIP = cache.ip;
  return currentIP;
};

const setCachedIP = (ip) => {
  const cachePath = path.join(__dirname, '..', 'cache', 'public-ip.json');
  fs.writeFileSync(cachePath, JSON.stringify({ ip }));
};

const updateCloudflare = async (ip) => {
  console.log(`[DDNS] Updating Cloudflare with IP: ${ip}`);
  try {
    const dnsRecords = await cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID);
    const dnsRecord = _.find(dnsRecords.result, { name: process.env.CLOUDFLARE_DNS_NAME });
    if (dnsRecord && dnsRecord.content !== ip) {
      await cf.dnsRecords.edit(process.env.CLOUDFLARE_ZONE_ID, dnsRecord.id, {
        name: process.env.CLOUDFLARE_DNS_NAME,
        type: 'A',
        content: ip,
      });

      return true;
    }
  } catch (error) {
    console.log(error);
    console.log(error.response.body);
  }

  return false;
};

const start = async () => {
  // get the public IP from a free service
  console.log('[DDNS] Getting Public IP');
  const { data: { ip } } = await axios.get('https://api.ipify.org?format=json');
  console.log(`[DDNS] Public IP: ${ip}`);

  // read the current IP from a cache file
  const currentIP = getCachedIP();
  if (ip && ip !== currentIP) {
    // send the currentIP to Cloudflare
    const success = await updateCloudflare(ip);
    if (success) {
      // update the cache file
      setCachedIP(ip);
    }
  }
};

module.exports = start;
