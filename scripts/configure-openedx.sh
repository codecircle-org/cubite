 #!/bin/bash

# Usage: ./configure-openedx.sh <domain> <studio_domain> <site_name>
DOMAIN=$1
STUDIO_DOMAIN=$2
SITE_NAME=$3

source /root/venv/bin/activate

tutor config save \
    --set CMS_HOST="${STUDIO_DOMAIN}" \
    --set LMS_HOST="${DOMAIN}" \
    --set PLATFORM_NAME="${SITE_NAME}" \
    --set ENABLE_HTTPS=true \
    --set ACTIVATE_HTTPS=true \
    --set CONTACT_EMAIL="support@${process.env.MAIN_DOMAIN}"

tutor local launch -I 