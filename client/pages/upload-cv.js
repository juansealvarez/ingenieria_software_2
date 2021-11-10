import {useState, useContext,useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import {SyncOutlined } from '@ant-design/icons'
import {Context} from '../context'
import {useRouter} from 'next/router'



const UploadCV = ()  =>{

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square"> Gestor de CV </h1>
            <body class="container">
                <div>
                    <h1>Subir CV</h1>
                </div>
                <form >
                    <input id="file" type="file" className= "form-control mb-4 p-4" placeholder="Sube tu CV aqui" required/>
                    <button type="submit" className="btn btn-block btn-primary "> Submit CV</button>
                    <button type="submit" hidden className="btn btn-block btn-primary "> Delete CV</button>
                </form>
            </body>

        </>
    )
}

export default UploadCV;