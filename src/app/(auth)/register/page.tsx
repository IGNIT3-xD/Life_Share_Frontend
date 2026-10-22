import { getDemoAccounts } from "../_components/demo-accounts";
import { RegisterView } from "./_components/RegisterView";

export default function RegisterPage() {
    const demoAccounts = getDemoAccounts();

    return <RegisterView demoAccounts={demoAccounts} />;
}
