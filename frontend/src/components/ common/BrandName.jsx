export default function BrandName(props) {
  const { theme } = props;
  return (
    <div className={"file-text-container " + theme}>
      <p>
        f<span>i</span>le
      </p>
    </div>
  );
}
