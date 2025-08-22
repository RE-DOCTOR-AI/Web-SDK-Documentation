# Running application locally
This is instruction how to get the app using the `redoctor-sdk` running locally.

## Prerequisites

1. You have aws cli installed and your IAM keys are stored in `~/.aws/credentials` under `[<your_aws_profile>]` profile (use the name of your org).
   ```
   [<your_aws_profile>]
   aws_access_key_id = xxxxxxxxxxxxxxx
   aws_secret_access_key = yyyyyyyyyyyyyyyyyyyyy
   ```
   
2. ngrok installed: `brew install ngrok` (camera can be used only when https is used, ngrok provides a free https
   proxy).
3. Create a free account in [ngrok](https://ngrok.com/) to get your auth token and configure the client.
   ```
   ngrok config add-authtoken <your_auth_token>
   ```


## Steps

1. Login to CodeArtifact, adjust profile to match your configuration
    ```
    aws codeartifact login --tool npm --domain-owner 491963380458 \
      --domain re-doctor-sdk \
      --repository npm-releases \
      --profile <your_aws_profile> \
      --region eu-central-1 \
      --namespace @redoctor
    ```
2. Create `.env` file (it is already in gitignore) in the project root directory with the following content:
    ```
    VITE_REDOCTOR_SDK_SDK=<your_license_key>
    ```
   Replace `<your_license_key>` with your actual license key.

3. Install dependencies
    ```
    npm i
    ```
4. Run the project
    ```
    npm run dev
    ```
5. Expose the local server to the internet using ngrok
    ```
    ngrok http 5173
    ```
6. Open the ngrok URL in your browser to access the application.