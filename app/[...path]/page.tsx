import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routes } from "../pages/routes";

type PageProps = {
  params: Promise<{ path: string[] }>;
};

function getRoute(path: string[]) {
  return path.length === 1 ? routes[path[0]] : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const route = getRoute((await params).path);

  return route ? { title: route.title } : {};
}

export function generateStaticParams() {
  return Object.keys(routes).map((path) => ({ path: [path] }));
}

export default async function Page({ params }: PageProps) {
  const route = getRoute((await params).path);

  if (!route) {
    notFound();
  }

  const RoutePage = route.component;

  return <RoutePage />;
}
