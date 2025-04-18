import { useState } from "react";
export default function FileServices({
  isItYou,
  file,
  idx,
  onDelete,
  setUpdate,
}) {
  const [isCheck, setIsCheck] = useState(false);
  const [isVisble, setIsVisible] = useState(file.file_visibility);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="file-conteiner">
      <input
        id="check"
        type="checkbox"
        onClick={() => {
          setIsCheck(!isCheck);
        }}
        checked={isCheck}
      />
      {isItYou && (
        <div className="file-buttons">
          <div
            className="visib-btn"
            onClick={() => {
              //тут отправь запрос на скрытие или открытие
              setIsVisible(!isVisble);
            }}
          >
            <img
              src={`/pictures/${isVisble ? "showic.png" : "unshowic.png"}`}
              alt="vis"
            ></img>
          </div>
          <div
            className="del-btn"
            onClick={() => {
              onDelete(file).then(() => {
                setUpdate(file.file_id);
                setIsLoading(false);
              });
              setIsLoading(true);
            }}
          >
            {isLoading ? (
              <div class="loader"></div>
            ) : (
              <img src="/pictures/delic.svg" alt="del" />
            )}
          </div>
        </div>
      )}
      <div
        className="file-name"
        onClick={() => {
          setIsCheck(!isCheck);
        }}
      >
        <p>
          <span>{idx + 1 + ". "}</span>
          {file.file_name}
        </p>
      </div>
    </div>
  );
}
