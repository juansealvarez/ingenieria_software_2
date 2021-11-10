import User from '../models/user'
import {hashPassword,comparePassword} from "../utils/auth"
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};
  
const SES = new AWS.SES(awsConfig);

export  const register = async (req,res) =>{
    try{
        //console.log(req.body);
        const {name,email,password} = req.body
        //validacion
        if (!name) return res.status(400).send("Nombre es requerido")
        if(!password || password.length < 6){
            return res.status(400).send("La contraseña debe tener un minimo de 6 caracteres")
        }
        let userExist = await User.findOne ({email}).exec();
        if (userExist) return res.status(400).send("El correo ya esta registrado");

        //hash password
        const  hashedPassword  = await hashPassword (password);

        //registro
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        await user.save();
        console.log("usuario guardado ", user);
        return res.json({ok:true});

    } catch (err){
        console.log(err);
        return res.status(400).send("Error Intentelo otra vez")
    }
}

export const login = async(req,res) => {
    try{
        
        const {email, password} = req.body
        // Verificar si el  usuario existe
        const user= await User.findOne({email}).exec();
        if(!user) return res.status(400).send("Usuario no encontrado")
        //Verificar la contraseña
        const match = await comparePassword (password, user.password);
        //Crear signed jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn:"7d",
        })
        user.password = undefined;
        res.cookie("token", token ,{
            httpOnly: true,
            //secure: true, ///Solo para https en caso se pueda usar 
        })

        res.json(user);

    } catch(err){
        console.log(err);
        return res.status(400).send("Error .Intentalo en otro momento")
    }

}

export const logout  =async(req,res) =>{
    try{
        res.clearCookie("token")
        return res.json({message:"signout success"})

    } catch(err){
        console.log(err)
    }
}

export const currentUser =async(req,res) =>{
    try{
        const user  = await User.findById(req.user._id).select('-password').exec();
        console.log("CURRENT_USER", user)
        return res.json({ok:true});
    } catch (err){
        console.log(err)
    }
}

export const sendTestEmail = async (req, res) => {
    // console.log("send email using SES");
    // res.json({ ok: true });
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: ["reactnodeaws@gmail.com"],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <h1>Reset password link</h1>
                <p>Please use the following link to reset your password</p>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Password reset link",
        },
      },
    };
  
    const emailSent = SES.sendEmail(params).promise();
  
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
};
