const Site_Config = {
  title: "Evently",
  defaultTitle:
    "Evently  | Discover and buy tickets for the best events near you!",
  description:
    "Discover and buy tickets for the best events near you! Concerts, sports, theater, festivals, and more — all at your fingertips. Secure your spot today!",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL,
};

export default Site_Config;
