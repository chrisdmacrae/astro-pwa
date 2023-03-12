import type { RouterProps } from ".";

export const Home = ({ routes, baseUrl }: RouterProps) => (
    <p className="flex flex-col gap-2">
      <a href={`${baseUrl}/router/a`}>Go to a</a>
      <a href={`${baseUrl}/router/b`}>Go to b</a>
      {routes.map(route => (
        <a href={`${baseUrl}/router/${route}`}>Go to {route}</a>
    ))}
    </p>
  )