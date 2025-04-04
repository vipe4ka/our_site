import Header from "./Header";
import BrandName from "./ common/BrandName";
import GreenButton from "./ common/GreenButton";

export default function OtherPage(props) {
  return (
    <>
      <Header isLog={true} />
      <div className="block-file-container">
        <BrandName theme={"dark"} />
      </div>
      <div>
        <div className="user-container">
          <div className="other-header">
            <p className="main-text-header">{props.name.toUpperCase()}</p>
            <img
              className="check-icon"
              src="/pictures/check-icon.png"
              alt="check-icon"
            ></img>
            <img
              className="user-file-icon"
              src="/pictures/user-file.png"
              alt="file"
            ></img>
          </div>
        </div>
        <div className="user-content-container other-content">
          <p>Список файлов:</p>
        </div>

        <div className="user-content"></div>
      </div>
      <GreenButton mode={"small-button share-btn"} content={"Скачать"} />
    </>
  );
}
