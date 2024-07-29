import fs from "fs"
import FormData from "form-data";
import axios from "axios";



async function uploadFile(filePath, url, token) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(url, form, {
      headers: {
        Authorization: `bearer ${token}`,
        ...form.getHeaders()
      }
    });
    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

export default uploadFile;