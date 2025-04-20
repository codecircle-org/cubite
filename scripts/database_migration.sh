docker-compose -f docker-compose.dev.yml down
docker compose down && docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec web npx prisma migrate dev --name add_customCss_for_sites
docker compose exec web npx prisma migrate deploy

aws s3api put-bucket-cors \
--bucket cubite-storage \
--endpoint-url=https://hel1.your-objectstorage.com \
--cors-configuration file://storage_policy.json \
--profile hetzner