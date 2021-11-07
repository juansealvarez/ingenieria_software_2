import {useState, useContext,useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import {SyncOutlined } from '@ant-design/icons'
import Link from "next/link";
import {Context} from '../context'
import {useRouter} from 'next/router'

const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
        //falta que suba a la BD
        setLoading(true)
        const {data} = await axios.post(`/api/upload`,{
        cv,
        });
        dispatch({
            type:"POST",
            payload:data,
        })
        router.push("/profile");
        
    } catch(err){
        toast(err.response.data)
        setLoading(false)
    }

}

const Profile = ()  =>{
    return (
        <>
            <body class="container">
                <div>
                    <h1>Perfil</h1>
                </div>
                <form  onSubmit={handleSubmit}>
                    <button type="submit" className="btn btn-block btn-primary " disabled={!pdf}> {loading ? <SyncOutlined spin />: "Submit CV"}</button>
                    <button type="submit" hidden className="btn btn-block btn-primary " disabled={!pdf}> {loading ? <SyncOutlined spin />: "Delete CV"}</button>
                </form>
            </body>
            <script src="cv.js"></script>
        </>
    )
}

export default Profile;