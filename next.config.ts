import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io",
				pathname: "/f/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/a/**",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
