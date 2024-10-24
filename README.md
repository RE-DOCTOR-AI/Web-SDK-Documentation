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
          app.use(express.static(path.join(__dirname, 'ReDoctorWebSDK')));
          
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
      
      - `ReDoctorWebSDK` folder (contains your compiled HTML and JS files)
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
</details>

## How to integrate Re.Doctor Web SDK into your web solution

