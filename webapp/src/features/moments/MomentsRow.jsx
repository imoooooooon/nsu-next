import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import { MomentsRail } from "../../../../src/shared/MomentsRail";

export function MomentsRow({ moments }) {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  return (
    <MomentsRail
      moments={moments}
      t={t}
      isDark={isDark}
      onCreateClick={() => navigate("/moments/create")}
      onOpenNote={(group) => navigate(`/moments/note/${group.id}`)}
    />
  );
}
