import axios from 'axios';


export const createCategory = async () =>{

    return axios.post('http://localhost:5000/api/category')
}