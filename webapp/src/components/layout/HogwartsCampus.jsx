import campusLineart from '../../assets/hogwarts-campus-lineart.png';

export function HogwartsCampus() {
  return (
    <div className="auth-campus" aria-hidden="true">
      <img src={campusLineart} alt="" width="1774" height="887" draggable="false" />
    </div>
  );
}
