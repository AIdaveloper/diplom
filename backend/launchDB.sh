docker run --name diploma-postgres -e POSTGRES_PASSWORD=diploma -d -p 5432:5432 postgres

# npx prisma migrate dev