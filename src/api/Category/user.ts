

export function getUser()
{
     const user=JSON.stringify((localStorage.getItem('user')))
     if(user){
      const data=JSON.parse(user)
      return data;
      }
   
      return null;
     
}