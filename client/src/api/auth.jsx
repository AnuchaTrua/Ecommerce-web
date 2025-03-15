import axios from 'axios';


export const currentUser = async (authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );


export const currentAdmin = async (authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/current-admin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );