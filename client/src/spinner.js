import loading from "./loading.gif";

export default function spinner() {
  return (
    <img
      src={loading}
      alt="loading gif"
      style={{
        width: "200px",
        height: "200px",
      }}
    />
  );
}
