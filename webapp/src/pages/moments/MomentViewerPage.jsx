import { useParams } from "react-router-dom";
import { InstantDialog } from "../../../../src/shared/InstantExperience";
import { momentPeople as globalMomentsData } from "../../../../src/shared/momentPeople";
import { useCloseTo } from "../../lib/navigation";

// Existing author URLs now open Moments. StoryViewerPage is intentionally not routed.
export default function MomentViewerPage() {
  const { momentId } = useParams();
  const close = useCloseTo("/home");
  const author = globalMomentsData.find((group) => group.id === momentId);
  return (
    <InstantDialog
      authorId={momentId}
      authorName={author?.user.name || "this person"}
      onClose={close}
    />
  );
}
