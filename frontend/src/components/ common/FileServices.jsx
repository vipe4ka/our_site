import { useState } from "react";
<<<<<<< HEAD
import UserService from "../../services/UserService";
import { Context } from "../..";
import { useContext } from "react";
export default function FileServices({ isItYou, file, idx, onDelete }) {
  const { store } = useContext(Context);
=======
export default function FileServices({
  isItYou,
  file,
  idx,
  onDelete,
  setUpdate,
}) {
>>>>>>> ecdfa2378119a27bd750ed66dd0240be0724ffb2
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
<<<<<<< HEAD
            onClick={async () => {
              // Запрос на скрытие или открытие
              UserService.changeVisibilityRequest(store.user, file.file_id, !isVisble ? 1 : 0)
                .then(() => setIsVisible(!isVisble))
                .catch(console.error);
=======
            onClick={() => {
              //тут отправь запрос на скрытие или открытие
              setIsVisible(!isVisble);
>>>>>>> ecdfa2378119a27bd750ed66dd0240be0724ffb2
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
