
import { render } from "./dist-server/entry-server.js";

try {
  const result = render("/worker/test", {
    worker: {
      id: "test",
      fullName: "Test Worker",
      category: "Elektricist",
      city: "Prishtinë",
      isPro: false,
      phoneNumber: "38344123456",
      portfolio: [],
    },
    reviews: [],
  });

  console.log("SSR render successful!");
  console.log("HTML length:", result.appHtml.length);
  console.log("Contains worker name:", result.appHtml.includes("Test Worker"));
  console.log("Helmet available:", Boolean(result.helmet));
} catch (error) {
  console.error("SSR render failed:");
  console.error(error);
  process.exit(1);
}
