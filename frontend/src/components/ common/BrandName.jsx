import { Link } from "react-router";

export default function BrandName(props) {
  const { theme } = props;
  return (
    <Link to="/" className="back-link">
      <div className={"file-text-container " + theme}>
        <p>
          f<span>i</span>le
        </p>
      </div>
    </Link>
  );
}
