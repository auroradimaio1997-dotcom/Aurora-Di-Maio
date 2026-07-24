const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "Aurora-Di-Maio";
const basePath = isGithubPages ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
  // Without this, the App Router's client-side segment cache can serve a
  // stale page on browser back/forward navigation — visible as "the old
  // version comes back" after we've just changed that page.
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
