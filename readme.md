# PubSub Topic Logger

This is a simple app that will create a subscription on a named PubSub topic and log ever message as it sees it. Useful for troubleshooting message queues.

## Installation

1. Clone this repo.
2. Run `yarn` or `npm install`.
3. For your GCP project with PubSub API, create a service account with project owner permissions and download the credentials as a json file. Copy file into root of this folder, renamed as `pubsub-service.json`.
4. Copy `.env.example` -> `.env` and edit, to set:

   ```
   MESSAGE_BUS_PROJECT_ID= <The GCP project id>
   TOPIC= <The topic name that you want to listen to>
   ```

## Run

Run with `yarn start`

If a topic doesn’t exist, the app will create it and start listening/logging. So you can publish test messages from the GCP UI and see them come through.
