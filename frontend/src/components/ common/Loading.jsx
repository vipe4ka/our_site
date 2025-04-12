export default function Loading() {
  return (
    <div
      className="wave-bouncing-loading-animation"
      role="alert"
      aria-busy="true"
      aria-label="Loading"
    >
      <span style={{ "--item": 1 }}>L</span>
      <span style={{ "--item": 2 }}>O</span>
      <span style={{ "--item": 3 }}>A</span>
      <span style={{ "--item": 4 }}>D</span>
      <span style={{ "--item": 5 }}>I</span>
      <span style={{ "--item": 6 }}>N</span>
      <span style={{ "--item": 7 }}>G</span>
    </div>
  );
}
