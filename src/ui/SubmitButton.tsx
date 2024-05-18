import { HTMLAttributes} from "react";
import { useNavigation } from "react-router-dom";

interface Props extends HTMLAttributes<HTMLButtonElement>{
    text:string
}
const SubmitBtn = ({ text,...rest}:Props) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      className={`rounded-md p-2 w-full ${rest.className}`}
      type="submit"
      disabled={isSubmitting}
    >
      {navigation.state=='submitting' && '...submitting' || text}
    </button>
  );
};
export default SubmitBtn;
