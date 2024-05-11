
import FormInput from '../ui/FormInput';
import { Form, redirect } from 'react-router-dom';
import SubmitButton from '../ui/SubmitButton';
import axios from 'axios';
import { toast } from 'react-toastify';

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
         toast.error("Invalid credentails")
        console.log(error)
         return error
    }
}
const Login = () => {
  return (
    <>
      <section className="h-screen grid place-items-center">
        <Form method="post" className="card w-96 p-8  flex flex-col gap-y-4">
          <h4 className="text-center text-3xl font-bold">Login</h4>
          <FormInput
            className="border border-gray-200 mt-2"
            type="email"
            label="email"
            name="email"
          />
          <FormInput
            className="border border-gray-200 mt-2"
            type="password"
            label="password"
            name="password"
          />
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