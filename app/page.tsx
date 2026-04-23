import { getLegacyLandingHtml } from "../lib/legacyLanding";

export default async function HomePage() {
  const { styleTagInnerHtml, bodyInnerHtml } = await getLegacyLandingHtml();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleTagInnerHtml }} />
      <div dangerouslySetInnerHTML={{ __html: bodyInnerHtml }} />
    </>
  );
}
