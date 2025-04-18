import FileServices from "./ common/FileServices";
import UserService from "../services/UserService";
import { Context } from "..";
import { useContext } from "react";

export default function FileList({ f_list, isYou, setUpdate }) {
  const { store } = useContext(Context);

  async function handledelete(file){
    return await UserService.deleteRequest(store.user, file.file_id);
  }
  return (
    <div className="file-list">
      {f_list.map((file, idx) => (
        <FileServices
          key={file.file_id}
          isItYou={isYou}
          idx={idx}
          file={file}
          onDelete={handledelete}
          setUpdate={setUpdate}
        />
      ))}
    </div>
  );
}
