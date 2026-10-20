import { StoryPage, storyMetadata } from "@/components/story-page";
import { routes } from "@/lib/routes";

export const metadata = storyMetadata(routes.relyxus);

export default function Page() {
  return <StoryPage path={routes.relyxus} />;
}
