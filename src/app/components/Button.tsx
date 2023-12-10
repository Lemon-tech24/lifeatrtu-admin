import { Button } from "@/types/buttonTypes";

function Button({ type, style, content, onClick }: Button) {
  return (
    <button type={type} className={style} onClick={onClick}>
      {content}
    </button>
  );
}

export default Button;
