##### DEPENDENCIES
# Use the official Node.js 18 Alpine image as the base image
FROM --platform=linux/amd64 node:18-alpine3.17 AS deps

# Install the OS dependencies required by the application
RUN apk add --no-cache libc6-compat openssl

# Set the working directory to /app
WORKDIR /app

# Copy the package files for dependency installation
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install the Node.js dependencies using the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npx pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### BUILDER
# Use the same base image for the "builder" stage
FROM --platform=linux/amd64 node:18-alpine3.17 AS builder

# Set arguments and environment variables in one layer
ARG NODE_ENV
ARG PUSHER_APP_ID
ARG PUSHER_APP_KEY
ARG PUSHER_APP_SECRET
ARG PUSHER_APP_CLUSTER
ARG RESEND_API_KEY
ARG AZURE_AD_CLIENT_ID
ARG AZURE_AD_TENANT_ID
ARG AZURE_AD_CLIENT_SECRET
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_PUSHER_APP_KEY
ARG NEXT_PUBLIC_BASEAPI_URL
ARG NEXT_AUTH_SECRET
ARG AUTH_SECRET
ENV NODE_ENV=${NODE_ENV} \
    NEXT_TELEMETRY_DISABLED=1 \
    PUSHER_APP_ID=${PUSHER_APP_ID} \
    PUSHER_APP_KEY=${PUSHER_APP_KEY} \
    PUSHER_APP_SECRET=${PUSHER_APP_SECRET} \
    PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER} \
    RESEND_API_KEY=${RESEND_API_KEY} \
    AZURE_AD_CLIENT_ID=${AZURE_AD_CLIENT_ID} \
    AZURE_AD_TENANT_ID=${AZURE_AD_TENANT_ID} \
    AZURE_AD_CLIENT_SECRET=${AZURE_AD_CLIENT_SECRET} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT} \
    NEXT_PUBLIC_PUSHER_APP_KEY=${NEXT_PUBLIC_PUSHER_APP_KEY} \
    NEXT_PUBLIC_BASEAPI_URL=${NEXT_PUBLIC_BASEAPI_URL} \
    NEXT_AUTH_SECRET=${NEXT_AUTH_SECRET} \
    AUTH_SECRET=${AUTH_SECRET}

# Set the working directory to /app
WORKDIR /app

# Copy the Node.js dependencies from the "deps" stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the application code to the working directory
COPY . .

# Build the application
RUN \
  if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
  elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
  elif [ -f pnpm-lock.yaml ]; then SKIP_ENV_VALIDATION=1 npx pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### RUNNER
# Use the same base image for the "runner" stage
FROM --platform=linux/amd64 node:18-alpine3.17 AS runner

# Set the working directory to /app
WORKDIR /app

# Set environment variables
ENV NODE_ENV production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Create a non-root "nodejs" group and user for running the application
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs \
  && chown -R nextjs:nodejs /app

# Copy the application files to the "runner" stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the user to "nextjs" and expose port 3000
USER nextjs
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
