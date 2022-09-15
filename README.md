## node-cloudflare-ddns

A low resource ExpressJS service that will update your Cloudflare DNS record when the public IP address of your server changes.

## Environment variables

    CLOUDFLARE_TOKEN
Your Cloudflare API token

    CLOUDFLARE_ZONE_ID
The Zone ID where your DNS records live

    CLOUDFLARE_DNS_NAME
The full name of your DNS record (e.g.: test.example.com)

## Notes
- Only A-type records are supported at this time.
- The IP address is determined via polling, this is not always ideal for high-availability services
- Relies on [ipify.org](https://ipify.org)
