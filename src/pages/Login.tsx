
import FormInput from '../ui/FormInput';
import { Form, redirect } from 'react-router-dom';
import SubmitButton from '../ui/SubmitButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';


interface userResponse{
    message:string,
    data:string
}

export async function action(request:Request){
    try{   
    const formData = await request.formData();
    const data={email:formData.get('email')?.toString(),password:formData.get('password')?.toString()}
     console.log(data)
    const response = await axios.post("https://beta-dot-roc-web-app.uc.r.appspot.com/admin/sign-in",data)
    console.log(response)
    if(response.data=='user not found')
      {
           toast.error("Invalid Credentails"); 
           return redirect('/login')
      }
    const token=response.data as userResponse
     const user={email:data.email,token:token.data}
     localStorage.setItem('user',JSON.stringify(user))
     toast.success('logged in successfully')
     return redirect('/')
    }catch(error)
    {
         toast.error("Invalid credentials")
        console.log(error)
         return error
    }
}
const Login = () => {

  
  const [showPassword, setShowPassword] = useState(false);
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <section className="h-screen grid place-items-center">
        <Form method="post" className="card w-96 p-8  flex flex-col gap-y-4">
          <div className="box-border">
            <h4 className="text-center text-3xl p-3 font-bold">Login</h4>
          </div>
          <FormInput
            className="border border-gray-200 mt-2"
            type="email"
            label="email"
            name="email"
          />
          <div className='relative'>
            <FormInput
              className="border border-gray-200 mt-2"
              type={showPassword ? "text" : "password"}
              label="password"
              name="password"
            />
            <FontAwesomeIcon
              className="absolute top-12 right-4"
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="mt-4">
            <SubmitButton className="bg-sky-200" text="login" />
          </div>
        </Form>
      </section>
      ;
    </>
  );
}

export default Login