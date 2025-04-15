import FileServices from "./ common/FileServices";

export default function FileList({ f_list, isYou, setUpdate }) {
  return (
    <div className="file-list">
      {f_list.map((file, idx) => (
        <FileServices
          key={file.file_id}
          isItYou={isYou}
          idx={idx}
          file={file}
          onDelete={() => {

            // тут вызови удаление файла из БД
            setUpdate(file.file_id);
          }}
        />
      ))}
    </div>
  );
}
