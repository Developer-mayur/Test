import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import  jwt  from  "jsonwebtoken"
// import transporter from "../middleware/Mailer.js"
import {generatetoken} from "../middleware/auth.js"
import { transporter } from "../middleware/Mailer.js";

// - Users are able to sign up using unique email only.

export let Signup = async (req, res) => {
  try {
    // console.log(req.body);
    let { firstName, LastName, email, passward } = req.body;
   

    if ( await User.findOne({ email }) ) {
      console.log("User already exist ");
      return res.json("User already exist ");
    }

    let hashpassward = await bcrypt.hash(passward, 10);

    const user = await User.create({
      firstName,
      LastName,
      email,
      passward: hashpassward,
    });
    return res.status(201).json({ massage: "user created successfully",User:user });
  } catch (error) {
    console.log(error.massage);
    return res.status(500).json({massage:error.massage})
  }
};




// - Users are able to login & get JWT tokens as a success response.
export let Signin = async (req, res) => {
    try {
    //   console.log(req.body);

      let { email, passward } = req.body;

     let user =  ( await User.findOne({ email }) ) ;


console.log(user);
      if ( !user )  {
        console.log("invalid   email ");
        return res.status(400).json("invalid   email ");
      }
 
// console.log(user);

      let isMatch = await bcrypt.compare(passward,user.passward);
    //   console.log(isMatch);
      if(!isMatch){
      return res.status(400).json({ massage: "invalid passward" });
    }
let token =jwt.sign({id:user._id,email:user.email},process.env.JWT_KEY,{expiresIn:"1h"});

return res.json({token:token,
    user:{
        id:user._id ,
        email:user.email,
        firstName:user.firstName,
        LastName:user.LastName

    }
    });


    } catch (error) {
      console.log(error.massage);
    }
  };




//   - Users are able to forget their password via reset password link on email.

  export let forgetpass = async (req, res) => {
try {

//   console.log(req.body);

let { email} = req.body;

let user =  ( await User.findOne({ email }) ) ;


// console.log(user);
 if ( !user )  {
   console.log("user not    found ");
   return res.status(400).json("invalid   email ");
 }
  
 const resetToken =Math.random()
    .toString(36).slice(2) + Date.now()
    .toString(36) + Math.random()
    .toString(36).
    toString(36);

 console.log(resetToken);

 const  resetTokenexpire =Date.now()+300000;
//  console.log(resetTokenexpire);
user.resetToken=resetToken;
user.resetTokenexpire=resetTokenexpire;
console.log(resetToken)
await user.save()
let base =process.env.BASE_URL;
const resetlink =`${base}/reset-passward?token=${resetToken}`;
console.log(resetlink);
console.log(resetToken)

await  transporter.sendMail({
    to:email,
    subject:"passward reset",
    html: `Click <a href =${resetlink}">here</a> to reset password.`
}
)
return res.json({massage:"reset link send"})
} catch (error) {
   console.log(error) ;
   return res.json({massage:error.massage})
}



  }



  export let Resetpass = async (req, res) => {
    let {token}=req.query;
    console.log(token)

    try {
    
      res.send(`
        <form onsubmit="handleSubmit(event)">
          <input type="hidden" id="token" value="${token}">
          <input type="password" id="newPassword" placeholder="New Password" required>
          <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
          <button type="submit">Reset Password</button>
        </form>
        <script>
          async function handleSubmit(e) {
            e.preventDefault();
            const res = await fetch('/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: document.getElementById('token').value,
                newPassword: document.getElementById('newPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value
              })
            });
            
            if (res.ok) {
              document.body.innerHTML = '<h3>Password updated successfully!</h3>';
              
            }
             
            
          }
        </script>
      `);
        
}
catch (error) {
   console.log(error) 
} }


export let updatepass = async (req, res) => {
try {
    const{token,newPassword,confirmPassword} =req.body;
    console.log(token)
    console.log(newPassword)
    console.log(confirmPassword)
 if(newPassword!=confirmPassword){
    res.json({massage:"password  do mot match"});
 }

 const user = await User.findOne({resetToken:token,
    resetTokenexpire:{$gt: Date.now()}
 });

if(!user){
    return res.json({
        massage:"invalid token"
    })
}
user.passward = await bcrypt.hash(newPassword,10);
user.resetToken=undefined;
user.resetTokenexpire=undefined;
await user.save();
res.json({massage:"password updated successfully"})


} catch (error) {
    return res.json({
        massage:error.massage })
}


}
