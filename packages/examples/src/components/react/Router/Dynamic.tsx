import { useRouter } from "astro-pwa/react";
import type { RouterProps } from ".";

export const Dynamic = ({ routes, baseUrl }: RouterProps) => {
    const router = useRouter()

    return (
        <p className="flex flex-col gap-2">
            <a href={`${baseUrl}/router`}>Go back</a>
            <a href={`${baseUrl}/router/a`}>Go to a</a>
            <a href={`${baseUrl}/router/b`}>Go to b</a>
            {routes?.filter(r => router.params?.slug !== r).map(route => (
                <a href={`${baseUrl}/router/${route}`}>Go to {route}</a>
            ))}
        </p>
    )
}