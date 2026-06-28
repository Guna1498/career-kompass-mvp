export default function Spinner({ inline = false }) {
  return <div className={inline ? "spinner-inline" : "spinner-page"} />;
}
