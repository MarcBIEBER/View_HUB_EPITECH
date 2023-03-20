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

// get all table by table name
const getAllTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        return data.Items;
    }
    catch (err) {
        console.log("Error", err.stack);
    }
}

// get user from hubUserTable by email
const getUser = async (userEmail) => {
    console.log(userEmail);
    const params = {
        TableName: process.env.USER_TABLE,
        Key: {
            email: userEmail
        },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        return data.Item;
    } catch (err) {
        console.log("Error: getUser:\n", err.stack);
        return undefined;
    }
}

// addItem in a specific table
const addItemAtTable = async (item, table) => {

    const params = {
        TableName: table,
        Item: item
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        return data;
    } catch (err) {
        console.log("Error", err.stack);
    }
};

// delete item in a specific table by name
const deleteItem = async (table, name) => {
    const params = {
        TableName: table,
        Key: {
            name: name,
        },
    };

    try {
        const data = await ddbDocClient.send(new DeleteCommand(params));
        return data;
    } catch (err) {
        console.log("Error", err.stack);
    }
};


// update an item in a specific table with a specific updateExpression and expressionAttributeValues
const updateItem = async (value, tableName, updateExpression, expressionAttributeValues) => {
    const params = {
        TableName: tableName,
        Key: {
            email: value,
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
    getAllTable,
    getUser,
    addItemAtTable,
    deleteItem,
    updateItem
}