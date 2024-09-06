FROM node:20-alpine

WORKDIR /migrations

COPY migrations schema.prisma seed.ts ./

CMD ["npx", "--yes", "prisma", "migrate", "deploy"]
