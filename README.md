# Vidzo - Next.js Video Platform

Vidzo is a modern web application built with Next.js, designed for an enhanced video experience. It features multi-platform video downloading capabilities, robust user authentication, and a comprehensive admin dashboard for site management.

## Features

- **Multi-Platform Video Downloading:** (Functionality to be detailed based on specific implementation)
- **User Authentication:** Secure user registration and login system (powered by Supabase).
- **Admin Dashboard:**
  - **General Settings:** Manage site title, description, logo, and favicon.
  - **SEO Settings:** Optimize meta tags (title, description, keywords) for better search engine visibility.
  - **Footer Settings:** Customize footer content, including copyright information and social media links.
- **Theme Management:** Supports light and dark modes for user preference, powered by `next-themes`.
- **Responsive Design:** Built with Tailwind CSS and shadcn/ui for a seamless experience across all devices.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Icons:** Lucide React
- **Backend/Auth:** Supabase
- **State Management:** React Hooks (useState, useEffect, useContext)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://your-repository-url/vidzo.git
    cd vidzo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Supabase credentials and other necessary environment variables:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Add other variables as needed
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to VPS (Virtual Private Server)

This guide outlines the steps to deploy your Next.js application to a VPS (e.g., DigitalOcean, Linode, AWS EC2) using PM2 as a process manager and Nginx as a reverse proxy.

### Prerequisites

- A VPS running a Linux distribution (e.g., Ubuntu).
- SSH access to your VPS.
- A domain name pointed to your VPS IP address (optional but recommended for SSL).
- Node.js and npm/yarn installed on the VPS.

### 1. Server Setup

Connect to your VPS via SSH.

**a. Update System Packages:**

```bash
sudo apt update && sudo apt upgrade -y
```

**b. Install Node.js (using NVM - Node Version Manager):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc # Or ~/.zshrc if you use zsh
nvm install --lts # Installs the latest LTS version of Node.js
nvm use --lts
# Verify installation
node -v
npm -v
```

**c. Install PM2 Globally:**
PM2 is a production process manager for Node.js applications.

```bash
npm install pm2 -g
```

**d. Install Nginx:**
Nginx will act as a reverse proxy.

```bash
sudo apt install nginx -y
```

### 2. Application Deployment

**a. Clone Your Repository:**
Clone your application code to a directory on your VPS (e.g., `/var/www/vidzo`).

```bash
sudo mkdir -p /var/www/vidzo
sudo chown $USER:$USER /var/www/vidzo # Give your user ownership for cloning
git clone https://your-repository-url/vidzo.git /var/www/vidzo
cd /var/www/vidzo
```

**b. Install Dependencies:**

```bash
npm install
```

**c. Create Production Environment File:**
Create a `.env.production` file (or `.env.local` if your build process uses it) in the project root (`/var/www/vidzo`) with your production environment variables (e.g., Supabase keys, database URLs).

```bash
nano .env.production
```

Add your production variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
# Ensure NODE_ENV is set to production if not handled by Next.js build
NODE_ENV=production
```

**d. Build the Application:**

```bash
npm run build
```

**e. Start Application with PM2:**
Start your Next.js application using the `npm start` script defined in your `package.json`.

```bash
pm2 start npm --name "vidzo-app" -- start
```

- `--name "vidzo-app"`: Assigns a name to your process.
- `-- start`: Tells PM2 to use the `start` script from your `package.json`.

**f. Configure PM2 to Start on Boot:**
Generate and configure a startup script to automatically restart your application if the server reboots.

```bash
pm2 startup
```

(Follow the instructions provided by the command, which usually involves running a command with `sudo`)

**g. Save PM2 Process List:**

```bash
pm2 save
```

### 3. Nginx Configuration (Reverse Proxy)

Configure Nginx to forward requests to your Next.js application running on `localhost:3000` (or the port Next.js starts on).

**a. Create Nginx Server Block:**

```bash
sudo nano /etc/nginx/sites-available/vidzo
```

**b. Add Configuration:**
Paste the following configuration, replacing `your_domain.com` with your actual domain name (or your VPS IP address if you don't have a domain).

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name your_domain.com www.your_domain.com; # Replace with your domain or IP

    root /var/www/vidzo; # Not strictly necessary for Next.js proxy, but good practice

    location / {
        proxy_pass http://localhost:3000; # Or the port your Next.js app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optional: Serve static assets directly from Next.js build output for better performance
    # location /_next/static/ {
    #     alias /var/www/vidzo/.next/static/;
    #     expires 1y;
    #     access_log off;
    # }

    # Optional: Handle image optimization requests if using Next.js Image component
    # location /_next/image {
    #     proxy_pass http://localhost:3000/_next/image;
    #     proxy_set_header Host $host;
    # }
}
```

**c. Enable the Site:**
Create a symbolic link from `sites-available` to `sites-enabled`.

```bash
sudo ln -s /etc/nginx/sites-available/vidzo /etc/nginx/sites-enabled/
```

(Optional: Remove the default Nginx configuration if it conflicts: `sudo rm /etc/nginx/sites-enabled/default`)

**d. Test Nginx Configuration:**

```bash
sudo nginx -t
```

If the test is successful, proceed.

**e. Restart Nginx:**

```bash
sudo systemctl restart nginx
```

### 4. Firewall Configuration (UFW - Uncomplicated Firewall)

If you have UFW enabled, allow HTTP and HTTPS traffic.

```bash
sudo ufw allow 'Nginx Full' # Allows both HTTP (80) and HTTPS (443)
# Or, if you only need HTTP for now:
# sudo ufw allow 'Nginx HTTP'
sudo ufw enable # If not already enabled
sudo ufw status # To check the status
```

### 5. SSL/TLS with Let's Encrypt (Recommended)

Secure your site with a free SSL certificate from Let's Encrypt using Certbot.

**a. Install Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

**b. Obtain and Install SSL Certificate:**
Replace `your_domain.com` with your domain name.

```bash
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

Certbot will automatically update your Nginx configuration for HTTPS and set up automatic renewal.

**c. Verify Auto-Renewal:**
Certbot usually sets up a cron job or systemd timer for renewal.

```bash
sudo certbot renew --dry-run
```

Your Vidzo application should now be deployed and accessible via your domain name (or VPS IP address) with HTTPS if you configured SSL.

## Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information. (You'll need to create a LICENSE file if you don't have one).
