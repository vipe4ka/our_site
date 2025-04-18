import { useState } from "react";
import UserService from "../../services/UserService";
import { Context } from "../..";
import { useContext } from "react";
export default function FileServices({ isItYou, file, idx, onDelete, setUpdate }) {
  const { store } = useContext(Context);
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
            onClick={async () => {
              // Запрос на скрытие или открытие
              UserService.changeVisibilityRequest(store.user, file.file_id, !isVisble ? 1 : 0)
                .then(() => setIsVisible(!isVisble))
                .catch(console.error);
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
