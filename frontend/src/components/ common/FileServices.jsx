import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { Context } from "../..";
import { useContext } from "react";

export default function FileServices({
  isItYou,
  file,
  idx,
  onDelete,
  setUpdate,
  isDownloading,
}) {
  const { store } = useContext(Context);
  const [isCheck, setIsCheck] = useState(false);
  const [isVisble, setIsVisible] = useState(file.file_visibility);
  const [isLoading, setIsLoading] = useState(false);

  const setChecked = (file_id) => {
    let list = JSON.parse(sessionStorage.getItem("checkList") || "[]");
    if (isCheck) {
      list = list.filter((id) => id !== file_id);
    } else {
      list.push(file_id);
    }
    sessionStorage.setItem("checkList", JSON.stringify(list));
  };

  useEffect(() => {
    sessionStorage.setItem("checkList", JSON.stringify([]));
    setIsCheck(false)
  }, [isDownloading]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(file);
      setUpdate(file.file_id);
    } finally {
      if (isCheck) {
        let list = JSON.parse(sessionStorage.getItem("checkList") || "[]");
        list = list.filter((id) => id !== file.file_id);
        sessionStorage.setItem("checkList", JSON.stringify(list));
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="file-conteiner">
      <input
        id="check"
        type="checkbox"
        onChange={() => {
          setIsCheck(!isCheck);
          setChecked(file.file_id);
        }}
        checked={isCheck}
      />
      {isItYou && (
        <div className="file-buttons">
          <div
            className="visib-btn"
            onClick={async () => {
              try {
                await UserService.changeVisibilityRequest(
                  store.user,
                  file.file_id,
                  !isVisble ? 1 : 0
                );
                setIsVisible(!isVisble);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <img
              src={`/pictures/${isVisble ? "showic.png" : "unshowic.png"}`}
              alt="vis"
            />
          </div>
          <div className="del-btn" onClick={handleDelete}>
            {isLoading ? (
              <div className="loader"></div>
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
          setChecked(file.file_id);
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
