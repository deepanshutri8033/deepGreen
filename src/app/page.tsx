import { HomeWithIntro } from "@/components/deepgreen/home-with-intro";
import { PageTransition } from "@/components/ui/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <HomeWithIntro />
    </PageTransition>
  );
}
