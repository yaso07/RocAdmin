import { Link } from "react-router-dom";

const Error = ({error}:{error:string}) => {
  if (error=='404') {
    return (
      <main className="grid min-h-[100vh] place-items-center px-8">
        <div className="text-center">
          <p className="text-9xl font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Page not found {error}
          </h1>
           
          <div className="mt-10">
            <Link to="/login" className="btn btn-secondary">
              go back login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-[100vh] place-items-center px-8">
      <h4 className="text-center font-bold text-4xl">{error}...</h4>
    </main>
  );
}

export default Error