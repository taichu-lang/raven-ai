import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
};

const withIntl = createNextIntlPlugin();

export default withIntl(nextConfig);
