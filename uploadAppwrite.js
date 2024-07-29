const fetch = require('isomorphic-fetch'); // Required for Dropbox API v2
const Dropbox = require('dropbox').Dropbox;
const fs = require('fs');

// const Dropbox =  DB.Dropbox

require("dotenv").config()

const accessToken = process.env.DB_ACCESS; // Replace with your access token
const dbx = new Dropbox({ accessToken, fetch });

async function uploadFile(filePath, dropboxPath) {
    try {
        const fileContent = fs.readFileSync(filePath);

        const response = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
            mode: { '.tag': 'overwrite' },
        });

        console.log('File uploaded successfully!', response);
    } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
    }
}

// Example usage:
const localFilePath = './csv/out-new-med-best-usa-rings-.csv'; // Replace with your file path
const dropboxFilePath = '/file.csv'; // Replace with the path where you want to store the file in Dropbox

uploadFile(localFilePath, dropboxFilePath);
