import axios from 'axios';
import {setAlert} from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR
} from './types';

import setAuthToken from '../utils/setAuthToken';


//load user
export const loadUser=()=> async dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token);

    }

    try{
        const config = {
          headers: {
            "x-auth-token": localStorage.token,
          },
        };
        const res=await axios.get('api/auth',config);

        dispatch({
            type:USER_LOADED,
            payload:res.data
        })
    }catch(err){
        console.log(err)
        dispatch({
            type:AUTH_ERROR
        })
    }
}

//register user
export const register=({name,email,password})=> async dispatch =>{
    const config={
        headers:{
            'Content-Type':'Application/json'
        }
    }
    const body=JSON.stringify({name,email,password});

    try {
        const res=await axios.post('api/users',body,config)

        dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
        })
        
    } catch (err) {

        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:REGISTER_FAIL
        })
        
    }
}