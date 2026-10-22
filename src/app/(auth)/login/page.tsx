import { LoginForm } from "@/components/login-form";
import { getDemoAccounts } from "../_components/demo-accounts";

const page = () => {
    const demoAccounts = getDemoAccounts();

    return (
        <div className="w-full pb-10 max-w-5xl mx-auto font-graphik">
            <LoginForm demoAccounts={demoAccounts} />
        </div>
    )
}

export default page
