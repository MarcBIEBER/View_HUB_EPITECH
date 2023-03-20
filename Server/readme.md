## Here is the server side of the project

### Prerequisites

1. You need to have nodejs installed on your machine
2. You need to have 3 different tables in your database
3. You need to have an AWS IAM user with all the permissions needed to access the database and the bucket

### How to start the project

1. First, you need to install the dependencies with `npm install`
2. Create a `.env` file with the following content:
    ```js
    AWS_BUCKET_REGION=yourBucketRegionHere

    DB_ACCESS_KEY=dataBaseAccessKeyHere
    DB_SECRET_KEY=dataBaseSecretKeyHere

    SECRET_KEY="secretKeyHere"

    ACCESS_TOKEN_SECRET=secretAceessTokenHere

    REFRESH_TOKEN_SECRET=secretTokenHere

    PORT=ThePortYouWantToUseHere

    ### Database tables name ###

    USER_TABLE="table1"
    PROJECT_TABLE="table2"
    INVENTORY_TABLE="table3"
    ```

3. Run the server with `npm start`