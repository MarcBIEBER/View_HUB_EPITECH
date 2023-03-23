require('dotenv').config();
const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.DB_ACCESS_KEY
const secretAccessKey = process.env.DB_SECRET_KEY

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.    
    convertEmptyValues: false, // false, by default.    
    // Whether to remove undefined values while marshalling.    
    removeUndefinedValues: true, // false, by default.    
    // Whether to convert typeof object to map attribute.    
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.    
    wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const client = new DynamoDBClient({
    region: region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);

const updateItemInventory = async (value, tableName, updateExpression, expressionAttributeValues) => {
    const params = {
        TableName: tableName,
        Key: {
            name: value,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };

    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        console.error("Error", err.stack);
    }
};

module.exports = {
    updateItemInventory
};