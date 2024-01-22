##### DEPENDENCIES
# Important! Driver must be bridge!
# Use the official Node.js 18 Alpine image as the base image for the "deps-os" stage
FROM --platform=linux/amd64 node:18-alpine3.17 AS deps-os

# Install the OS dependencies required by the application
RUN apk add --no-cache libc6-compat openssl

# Use the official Node.js 18 Alpine image as the base image for the "deps" stage
FROM --platform=linux/amd64 node:18-alpine3.17 AS deps

# Set the working directory to /app
WORKDIR /app

# Copy the package.json, yarn.lock, package-lock.json, and pnpm-lock.yaml files to the working directory
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install the Node.js dependencies using the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### BUILDER

# Use the official Node.js 18 Alpine image as the base image for the "builder" stage
FROM --platform=linux/amd64 node:18-alpine3.17 AS builder

ARG PUSHER_APP_ID
ARG PUSHER_APP_KEY
ARG PUSHER_APP_SECRET
ARG PUSHER_APP_CLUSTER
ARG RESEND_API_KEY
ARG NEXT_PUBLIC_AZURE_AD_CLIENT_ID
ARG NEXT_PUBLIC_AZURE_AD_TENANT_ID
ARG NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_PUSHER_APP_KEY
ARG NEXT_PUBLIC_BASEAPI_URL
ARG NEXT_AUTH_SECRET
ARG AUTH_SECRET

ENV PUSHER_APP_ID=$PUSHER_APP_ID \
    PUSHER_APP_KEY=$PUSHER_APP_KEY \
    PUSHER_APP_SECRET=$PUSHER_APP_SECRET \
    PUSHER_APP_CLUSTER=$PUSHER_APP_CLUSTER \
    RESEND_API_KEY=$RESEND_API_KEY \
    NEXT_PUBLIC_AZURE_AD_CLIENT_ID=$NEXT_PUBLIC_AZURE_AD_CLIENT_ID \
    NEXT_PUBLIC_AZURE_AD_TENANT_ID=$NEXT_PUBLIC_AZURE_AD_TENANT_ID \
    NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET=$NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT \
    NEXT_PUBLIC_PUSHER_APP_KEY=$NEXT_PUBLIC_PUSHER_APP_KEY \
    NEXT_PUBLIC_BASEAPI_URL=$NEXT_PUBLIC_BASEAPI_URL \
    NEXT_AUTH_SECRET=$NEXT_AUTH_SECRET \
    AUTH_SECRET=$AUTH_SECRET

RUN for var in NODE_ENV MSSQL_DATABASE_URL MSSQL_DATABASE_USER MSSQL_DATABASE_PASSWORD MSSQL_DATABASE_NAME \
    PG_DATABASE_USER PG_DATABASE_NAME PG_DATABASE_PASSWORD PG_DATABASE_HOST PROPELAUTH_KMC_SOLUTIONS_ORG_ID \
    PROPELAUTH_KMC_COMMUNITY_ORG_ID PROPELAUTH_API_KEY PROPELAUTH_VERIFIER_KEY PROPELAUTH_REDIRECT_URI \
    PROPELAUTH_CUSTOM_REDIRECT_AUTH_URL PUSHER_APP_ID PUSHER_APP_KEY PUSHER_APP_SECRET PUSHER_APP_CLUSTER \
    FACEBOOK_PAGE_ACCESS_TOKEN FACEBOOK_GRAPH_API_BASEURL FACEBOOK_GRAPH_API_VERSION FACEBOOK_APP_SECRET \
    FACEBOOK_PAGE_ID FACEBOOK_APP_ID RESEND_API_KEY LEXISNEXIS_API_KEY LEXISNEXIS_BASE_URL PANDADOC_CLIENT_ID \
    PANDADOC_CLIENT_SECRET MEMPHIS_HOST MEMPHIS_USERNAME MEMPHIS_PASSWORD MEMPHIS_STATION_NAME \
    MEMPHIS_PRODUCER_NAME NEXT_PUBLIC_ENVIRONMENT NEXT_PUBLIC_APP_URL NEXT_PUBLIC_AUTH_URL \
    NEXT_PUBLIC_PUSHER_APP_KEY NEXT_PUBLIC_ERP_CORE_API_BASE_URL NEXT_PUBLIC_ERP_AUTH_API_BASE_URL \
    NEXT_PUBLIC_NEXTJS_CORE_APP_API_BASE_URL NEXT_PUBLIC_NESTJS_CORE_APP_API_BASE_URL NEXT_PUBLIC_FILESTACK_API_KEY \
    NEXT_PUBLIC_PROPELAUTH_KMC_SOLUTIONS_ORG_ID NEXT_PUBLIC_PROPELAUTH_KMC_COMMUNITY_ORG_ID \
    NEXT_PUBLIC_PANDADOC_CLIENT_ID NEXT_PUBLIC_PANDADOC_DOCUMENT_URL DJANGO_REST_API_URL \
    NEXT_PUBLIC_DJANGO_REST_API_URL; do \
    if [ -z "${!var}" ]; then \
      echo "Environment variable $var is not set. Build cannot proceed." && exit 1; \
    fi; \
  done

# Set the working directory to /app
WORKDIR /app

# Copy the OS dependencies from the "deps-os" stage to the "builder" stage
COPY --from=deps-os /lib /lib
COPY --from=deps-os /usr/lib /usr/lib
COPY --from=deps-os /usr/local/lib /usr/local/lib

# Copy the Node.js dependencies from the "deps" stage to the "builder" stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the application code to the working directory
COPY . .

# Set the environment variable to disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application using the preferred package manager
RUN \
  if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
  elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### RUNNER

# Use the official Node.js 18 Alpine image as the base image for the "runner" stage
FROM --platform=linux/amd64 node:18-alpine3.16 AS runner

# Set the working directory to /app
WORKDIR /app

# Set the environment variables required by the application
ENV NODE_ENV production

# Set the environment variable to disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

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
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]