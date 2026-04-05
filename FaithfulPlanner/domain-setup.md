# Domain Setup: shifaatlanta.com with Cloudflare Tunnel

## Overview
This document describes how to set up a domain with Cloudflare Tunnel to expose a local application to the internet while keeping the main domain pointing to an existing service (e.g., WordPress on Ionos).

---

## Proxy Status: DNS only vs Proxied

When adding DNS records, you can choose:

**DNS only (recommended for existing services):**
- Traffic goes directly to your origin (Ionos)
- Cloudflare only handles DNS resolution
- Simpler setup, no SSL/certificate issues

**Proxied (for advanced protection):**
- Traffic goes through Cloudflare first, then to origin
- Includes: DDoS protection, caching, WAF, performance optimization
- Requires proper SSL/TLS configuration

For this setup, use **DNS only** for WordPress (existing service) and **Proxied** for the tunnel subdomain (new application).

---

## Step 1: Add Domain to Cloudflare

1. Go to **https://dash.cloudflare.com/**
2. Click **"+ Add a domain"**
3. Enter `shifaatlanta.com`
4. Choose **"Manually enter DNS records"**
5. Select **Free** plan
6. Add A record:
   - **Type:** A
   - **Name:** @ (root domain)
   - **Content:** `74.208.236.122` (your Ionos WordPress IP)
   - **Proxy status:** DNS only (or Proxied if you have SSL configured)
7. Click **"Continue to activation"**

---

## Step 2: Update Nameservers in Ionos

1. Go to **ionos.com** → **Domains & SSL**
2. Select **shifaatlanta.com**
3. Click **"Name server"** tab
4. Click **"Edit name server"**
5. Replace nameservers with Cloudflare's:
   - Delete old nameservers: `ns1068.ui-dns.biz`, `ns1068.ui-dns.com`, etc.
   - Add Cloudflare nameservers:
     - `crystal.ns.cloudflare.com`
     - `mitchell.ns.cloudflare.com`
6. Save changes

---

## Step 3: Verify Nameserver Propagation

In Cloudflare:
1. Go to **https://dash.cloudflare.com/**
2. Select **shifaatlanta.com**
3. Click **DNS** in left sidebar
4. Verify A record is present and propagation is complete (typically 1-24 hours)

---

## Step 4: Create Cloudflare Tunnel

1. Go to **https://one.dash.cloudflare.com/**
2. Click **"Create a tunnel"**
3. Choose **"Cloudflared"** as connector type
4. Name it: `time-shifaatlanta`
5. Copy the Docker command provided
6. Run on your local Linux machine:
   ```bash
   docker run -d --name time-shifaatlanta \
     cloudflare/cloudflared:latest tunnel \
     --no-autoupdate \
     run --token [YOUR_TOKEN]
   ```

---

## Step 5: Configure Tunnel Routing

1. In Cloudflare tunnel dashboard, select **`time-shifaatlanta`**
2. Go to **"Published application routes"** tab
3. Click **"Add a published application route"**
4. Fill in:
   - **Subdomain:** `time`
   - **Domain:** `shifaatlanta.com`
   - **Path:** (leave empty)
   - **Type:** HTTP
   - **URL:** `http://10.0.0.20:8080`
5. Click **Save**

---

## Recovering the Docker Token

If you lose the Docker command token:

1. Go to **https://one.dash.cloudflare.com/**
2. Select **`time-shifaatlanta`** tunnel
3. Go to **"Overview"** → **"Connectors"** section
4. Click **"Add a connector"**
5. Copy the new Docker command with token

**Note:** Each new token invalidates the old one. Save the Docker command for future reference.

---

## Result

- ✅ `https://shifaatlanta.com/` → WordPress on Ionos
- ✅ `https://time.shifaatlanta.com/` → Your application on `http://10.0.0.20:8080`

Both domains work simultaneously without changing your main WordPress setup.
