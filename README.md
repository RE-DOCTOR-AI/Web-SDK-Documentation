# Web-SDK-Documentation
Documentation for WEB SDK of the RE.DOCTOR Vitals software.<br/>
This repository contains demo Application with also plays a role of an example of integration of SDK into a Web page using just Javascript and HTML.

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
### Introduction
  RE.DOCTOR Web SDK is the software which allow to collect PPG signal and estimate some Helath parameter based on that.<BR/>
    On current version the following parameters are available:<BR/>
    1. Blood Oxygen<BR/>
    2. Heart Rate<BR/>
    3. Respiration Rate<BR/>
    4. Blood Pressure<BR/>
    5. Pulse Pressure<BR/>
    6. HRV<BR/>
    7. Stress<BR/>
    8. LASI<BR/>
    9. Reflection Index<BR/>
      Detailed explanation on those parameters can be found here: https://drive.google.com/file/d/1t3itxaFMvYszrI0Y-bqRbzoUnNX3AxhX/view?usp=drive_link
  
### Requirements
  This version of Web SDK was tested on the followinf platforms and browsers:
  
  Google Chrome, Safari.

  It also works on mobile devices such as smartphones and Tablets.

  In order to get the SDK file, please contact info@re.doctor

### SDK simple work process
```mermaid
        flowchart TD
        A(Start) -->B[Pass license key]
        B --> C[Prepare & Initialize SDK]
        C --> D[Capture and process video input]
        D --> F[Check statuses]
        F --> |anys status except CALCULATION_FINISHED|G[Do actions for statuses]
        G --> H{Status = CALCULATION_FINISHED}
        H --> |No|F
        H --> |Yes|J[Get results]
        J --> I(Finish)
  ```

### Preparing and Initializing Up the SDK
  Please see the file to get the example of integration. https://github.com/RE-DOCTOR-AI/Web-SDK-Documentation/blob/main/index.html

  Bear in mind that SDK requires user parameters:<BR/>
    - Height (cm)<BR/>
    - Weight (kg)<BR/>
    - Age (years)<BR/>
    - Gender (1 - Male, 2 - Female)<BR/>

  Those parameters will be required to initialize the SDK.
  
  Here are the important steps with some code examples.
  1. Import SDK file into your page
      ```Javascript
        <script src="tvs.js?v=1.6.0.11"></script>
      ```
     
  2. Check if the SDK loaded correctly
      ```Javascript
          if (typeof tvs !== 'undefined' && typeof tvs.initializeVitalSignsProcessor === 'function') {
      
          } else {
              console.error("initializeVitalSignsProcessor initialization error.");
          }
      ```
  3. Pass your License and initialize the SDK. Here you need to pass user data. (On the demo page those parameters are taken from Input fileds)
      ```Javascript
        if (typeof tvs !== 'undefined' && typeof tvs.initializeVitalSignsProcessor === 'function') {
          tvs.setLicenseKey("<your license key>")
    
          //initialize VitalSignsProcessor with user data. User data is required as it's used for Vitals calculations.
          var initResults = tvs.initializeVitalSignsProcessor(height.value, weight.value, age.value, gender.value)
          console. log (initResults)
    
        } else {
            console.error("initializeVitalSignsProcessor initialization error.");
        }
      ```
  4. Check the statuses<br/>
      ```Javascript
        /*
            We have several statuses before, during and after measurement.
            We work with those events here.
        */
        window.addEventListener("statusUpdate", function(event) {
            const { status, message } = event.detail; // Extract status and message
            window.currentStatus = status;
            ...
        }
      ```
      Here is the list of different statuses and their meaning. In brackets you see text which provided by SDK additionaly if that status accurs:</br>
        - `READY_TO_START("Ready to start")`</br></br>
        - `RED_INTENSITY_NOT_ENOUGH("Not good red intensity to process. Should start again")` Video has low red intensity which is crucial for the SDK</br></br>
        - `VALIDATION_ERROR("Validation error")` Some parameters of the video input didn't pass requirements. Usually mean video is too light or too dark.</br></br>
        - `IN_PROGRESS("Processing in progress")`</br></br>
        - `MEASUREMENT_FAILED("Measurement Failed. Should Start again")`</br></br>
        - `START_CALCULATING("Proceed to calculate the results")` Occurs when all data collected and SDK started to calculate parameters</br></br>
        - `CALCULATION_FINISHED("Calculation finished")`</br></br>
        
  5. Get results
     
      You can get results once you have status "CALCULATION_FINISHED".
      Here is code example how this can be done:
      ```Javascript
            //this status says us that calculations are done and we can get results from SDK
            if (window.currentStatus === "CALCULATION_FINISHED") {
                debugStatus.innerHTML = "";
                console.log("Processing finished with message:", message);
                const vitalsResults = document.getElementById("vitalsResults");
                const statusDiv = document.getElementById("status");
                statusDiv.style.display = "none";
                //const loader = document.getElementById("loader");
                //loader.style.display = "none";
    
    
                //Here we get values from SDK and show them to user.
                vitalsResults.innerHTML =
                    "SpO2: " + tvs.Vitals.bloodOxygen + " %<br>" +
                    "Pulse: " + tvs.Vitals.heartRate + " bpm<br>" +
                    "Respiration: " + tvs.Vitals.respirationRate + " bpm<br>" +
                    "Blood Pressure: " + tvs.Vitals.bloodPressureSystolic +"/" + tvs.Vitals.bloodPressureDiastolic + " mmHg<br>" +
                    "Pulse Pressure: " + tvs.Vitals.pulsePressure + " mmHg<br>" +
                    "HRV: " + tvs.Vitals.hrv + "<br>" +
                    "Stress: " + tvs.Vitals.stress + "<br>" +
                    "LASI: " + tvs.Vitals.lasi + "<br>" +
                    "Reflection index: " + tvs.Vitals.reflectionIndex + "<br>";
            //You can do some actions or show to user some additional info for those statuses
            } else if (window.currentStatus === "IN_PROGRESS" || window.currentStatus === "READY_TO_START") {
                debugStatus.innerHTML = message; // Show ongoing status message
            }
              else {
                debugStatus.innerHTML = message; // Show any other status message
            }
      ``` 

### License Key Setup
  Along with SDK files you will also get your License key. If you don't have it yet or need or have any questions, please send a request to info@re.doctor.

### Optional vs required fields.
On the page you have to have some elements which are required by the SDK.
You can easily find them on the demo html page.
Here are few examples of such elements:
```HTML
    
    <!--
        Video element is required bys SDK as it's used to pass the data to SDK.
        So please keep that div and it's id "videoElemen" on the page
    -->
    <video id="videoElement" width="354" height="288" hidden autoplay playsinline></video>
    <canvas id="canvas" style="overflow:auto" width="177" height="144" hidden></canvas>
    

    <!--
    Loader is required by SDK, meaning you need to keep that div with id "loader" on the page
    SDK uses that element to show loading gif while calculations are being made
    You can put your text here and use another loader.
    -->
    <div id="loader" class="small-loader" style="display: none;">
        <img src="Loader.gif" alt="Loading...">
        Calculating results
    </div>
```

### Customization
  You can customzie the look and feel of the page. Just keep the required elements on the page.

### Screenshots

<img width="215" alt="image" src="https://github.com/user-attachments/assets/23f79df0-df66-4752-b5cc-f105216554fe">
<img width="215" alt="image" src="https://github.com/user-attachments/assets/94b344e3-339c-4539-aa2f-1334c143143c">
<img width="215" alt="image" src="https://github.com/user-attachments/assets/84c40348-a885-4190-a35a-eee9bac759f3">



### Contacts
For any questions please contact info@re.doctor
