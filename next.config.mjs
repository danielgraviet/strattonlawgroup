import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
 poweredByHeader: false,
 reactStrictMode: true,
 outputFileTracingRoot: path.join(process.cwd()),
 images: {
 qualities: [60, 75]
 },
 experimental: {
 optimizePackageImports: ["lucide-react"]
 },
 async redirects() {
 // Old Squarespace URLs -> new pages.
 return [
 { source: "/our-team-1", destination: "/our-team", permanent: true },
 { source: "/contact-us", destination: "/contact", permanent: true },
 // Skip paths with a file extension so images in public/blog still load.
 { source: "/blog/:slug([^./]+)", destination: "/:slug", permanent: true }
 ];
 },
 async rewrites() {
 return {
 beforeFiles: [
 {
 source: "/((?!agent-markdown).*)",
 has: [
 { type: "header", key: "accept", value: "^text/markdown(?:\\s*[,;]|$)" }
 ],
 destination: "/agent-markdown?path=/:path*"
 }
 ]
 };
 },
 async headers() {
 return [
 {
 source: "/:path*",
 headers: [
 { key: "Vary", value: "Accept, Accept-Encoding" }
 ]
 }
 ];
 }
};

export default nextConfig;
