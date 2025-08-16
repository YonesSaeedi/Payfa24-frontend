import IconAlert from "../../../assets/Icons/Login/IconAlert";
import AlertTrue from "../../../assets/Icons/Login/IconTrueAlert";
import AlertFalse from "../../../assets/Icons/Login/IconFalseAlert";


interface PasswordConditionItemProps {
  ok: boolean;
  text: string;
  password: string;
}

export default function PasswordConditionItem({ ok, text, password }: PasswordConditionItemProps) {
  const color = password.length > 0 ? (ok ? "text-[var(--success)]" : "text-[var(--error)]") : "text-[var(--text-gray)]";
  const Icon = password.length > 0 ? (ok ? AlertTrue : AlertFalse) : IconAlert;

  return (
    <div className="flex gap-2 items-center">
      <span className="icon-wrapper h-4 w-4">
           <Icon />
      </span>
      <p className={color}>{text}</p>
    </div>
  );
}
