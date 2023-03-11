import type { RouterProps } from ".";

export const PageA = ({ routes, baseUrl }: RouterProps) => (
  <p className="flex flex-col gap-2">
    <a href={`${baseUrl}/router`}>Go back</a>
    <a href={`${baseUrl}/router/b`}>Go to b</a>
    {routes.map(route => (
        <a href={`${baseUrl}/router/${route}`}>Go to {route}</a>
    ))}
  </p>
)