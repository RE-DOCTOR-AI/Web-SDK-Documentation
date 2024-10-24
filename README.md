# Web-SDK-Documentation
Documentation for WEB SDK of the RE.DOCTOR Vitals software.

## How to set up and run Demo WebSDK
  ###  If you don't have a web server yet
<details>
  <summary> See details here </summary>
  
  1. **Prerequisites**
  
      Before you begin, ensure you have the following installed:
      - [Node.js](https://nodejs.org/) (version 12 or higher)
      - npm (comes with Node.js)
      <br/>

      1. Create a folder for the webserver (e.g. mywebserever)<br/><br/>
      2. Open your terminal and go to that folder. `cd <path to mywebserver>`<br/><br/>
      3. Generate SSL Certificate files<br/><br/>
        Run the following command to generate a self-signed SSL certificate:<br/>
        `openssl req -nodes -new -x509 -keyout key.pem -out cert.pem -days 365`<br/><br/>
        You will be prompted to enter information for the certificate. You can press Enter to skip optional fields.<br/><br/>
        Common Name (e.g., server FQDN or YOUR name): You can enter `localhost` or your domain name here.<br/><br/>
        This command will create two files: `key.pem` (the private key) and `cert.pem` (the public certificate).<br/><br/>
        Put them to your webserver folder (in this example folder name is: mywebserver).<br/><br/>
  
  2. **Project Setup**
      1. Clone the repository:<br/>
         ```bash
         git clone <your-repo-url>
         cd <your-project-directory>
         ```
         <br/>
      2. Copy the folder into your web server folder created on the step "Prerequisites" (in this example into the mywebserver folder)<br/><br/>
      3. Open terminal and go to your webserver folder<br/><br/>
      4. Install the necessary dependencies:<br/>
         ```bash
         npm install express http-proxy-middleware https fs path
         ```
  
  3. **Running the Server**
      1. Create the new file (e.g. server.js):<br/><br/>
         Make sure to update the paths for `key.pem` and `cert.pem` in the `server.js` file to match the location where you generated these files.
         ```javascript
          const express = require('express');
          const { createProxyMiddleware } = require('http-proxy-middleware');
          const https = require('https');
          const fs = require('fs');
          const path = require('path');
          
          const app = express();
          
          // Load your SSL certificates
          const options = {
              key: fs.readFileSync(path.resolve(__dirname, 'path/to/your/key.pem')),
              cert: fs.readFileSync(path.resolve(__dirname, 'path/to/your/cert.pem'))
          };
          
          // Serve your productionExecutable folder
          app.use(express.static(path.join(__dirname, 'Web-SDK-Documentation')));
          
          // Proxy settings
          app.use('/api', createProxyMiddleware({
              target: 'https://api.dev.redoctor.org', // Your API URL
              changeOrigin: true,
              pathRewrite: { '^/api': '' },
              secure: false, // Set to true if using a valid SSL certificate
          }));
          
          // Start the HTTPS server
          https.createServer(options, app).listen(443, () => {
              console.log('HTTPS Server running on port 443');
          });
         ```
  
  4. **Start the server**
  
     Run the following command in your terminal:
  
     ```bash
     node server.js
     ```
  
  5. **Access your application**
  
     Open your browser and navigate to `https://localhost/` to view your application.
  
  6. **Notes**
  
      To run the project, ensure you have the following files:
      
      - `Web-SDK-Documentation` folder (contains your compiled HTML and JS files)
      - `server.js` file
      - `key.pem` and `cert.pem` files
      - Replace `<your-repo-url>` and `<your-project-directory>` with actual values relevant to your project.
      - Adjust the section for generating SSL certificates if you want to include more detailed instructions or alternatives for obtaining certificates (e.g., using Let's Encrypt for production environments).
      
      Feel free to modify the content as needed to fit your project's specific requirements!

  
  7. **Important**
  
      Since this setup uses a self-signed certificate, you may receive a security warning in your browser. You can proceed by adding an exception for the self-signed certificate.
  
  8. **Troubleshooting**
  
      If you encounter any issues, make sure:
      
      - Node.js is properly installed and accessible in your terminal.
      - The paths to the certificate files in `server.js` are correct.
      - All dependencies are installed successfully.
  
</details>


### If you already have some web server
<details>
  <summary> See details here </summary>
  
  1. **Nginx Example**
        
        1. Copy your `Web-SDK-Documentation` folder to the server, under a directory like `/var/www/html/myapp` or any preferred location.<br/>
        2. Update the Nginx configuration to serve the files from that directory.<br/><br/>
           Open the Nginx configuration file, typically located at `/etc/nginx/sites-available/default` or a custom configuration file if they are using one.
           Add a location block to point to your `Web-SDK-Documentation` folder:
    
           ```nginx
           server {
               listen 80;
               server_name your-domain.com;
               location /myapp/ {
                   root /var/www/html;
                   index index.html;
                   try_files $uri $uri/ /myapp/index.html;
               }
               # Optional: Add reverse proxy for API calls
               location /api/ {
                   proxy_pass https://api.dev.redoctor.org/;
                   proxy_set_header Host $host;
                   proxy_set_header X-Real-IP $remote_addr;
                   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                   proxy_set_header X-Forwarded-Proto $scheme;
               }
           }
           ```
        3. Reload Nginx to apply the changes:
           ```bash
           sudo systemctl reload nginx
           ```
           After this, users will be able to access your app by visiting `http://your-domain.com/myapp/`.
        
  2. **Apache Example**
        1. Copy the `Web-SDK-Documentation` folder to a location like `/var/www/html/myapp`.
        
        2. Edit the Apache configuration file (commonly located in `/etc/apache2/sites-available/000-default.conf` or similar).
           Add a new `Alias` directive and set up the proxy for API calls:
           ```apache
           <VirtualHost *:80>
               ServerName your-domain.com
        
               Alias /myapp /var/www/html/myapp
               <Directory /var/www/html/myapp>
                   Options Indexes FollowSymLinks
                   AllowOverride None
                   Require all granted
               </Directory>
        
               # Optional: Reverse proxy for API calls
               ProxyPass /api https://api.dev.redoctor.org/
               ProxyPassReverse /api https://api.dev.redoctor.org/
           </VirtualHost>
           ```
        3. Enable required modules (if not already enabled)
           ```bash
           sudo a2enmod proxy proxy_http
           ```
        4. Restart Apache to apply the changes
           ```bash
           sudo systemctl restart apache2
           ```
           Now users can access the app at `http://your-domain.com/myapp/` with API calls proxied to your backend.
  </summary>
</details>

## How to integrate Re.Doctor Web SDK into your web solution

