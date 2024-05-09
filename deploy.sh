#!/bin/bash

pm2 stop api-donate
pm2 delete api-donate

pnpm i

pnpm build

pm2 --name api-donate start pnpm -- start:prod
