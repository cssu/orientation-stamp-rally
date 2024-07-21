FROM node:20-alpine

WORKDIR /migrations

COPY migrations schema.prisma ./

CMD ["npx", "--yes", "prisma", "migrate", "deploy"]
