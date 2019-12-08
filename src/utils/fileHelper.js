import moment from "moment";
import { v4 } from "uuid";
import axios from "axios";

export const formatFilename = filename => {
  const date = moment().format("YYYYMMDD");
  const randomString = v4();
  const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const newFilename = `images-tmp-fld/${date}-${randomString}-${cleanFileName}`;
  return newFilename.substring(0, 60);
};

export const uploadToS3 = async (file, signedRequest) => {
  var options = {
    headers: {
      "Content-Type": file.type
    }
  };
  return await axios.put(signedRequest, file, options);
};
