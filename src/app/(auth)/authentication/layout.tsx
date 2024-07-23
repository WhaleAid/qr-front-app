import { Suspense } from "react";

export default function AuthenticationLayout(props: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                {props.children}
            </div>
        </Suspense>
    );
}