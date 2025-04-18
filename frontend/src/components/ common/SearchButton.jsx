import { useState, useEffect } from "react";

export default function SearchButton({ setShowFiles, f_list }) {
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        if(f_list){
        const filteredFiles = f_list.filter(file => 
            file.file_name.toLowerCase().includes(searchVal.toLowerCase())
        );
        setShowFiles(filteredFiles);}
    }, [searchVal, f_list, setShowFiles]);

    function handleChange(event) {
        setSearchVal(event.target.value);
    }

    return (
        <div className="user-find">
            <input 
                type="text" 
                placeholder="Поиск файлов..." 
                value={searchVal}
                onChange={handleChange} 
            />
        </div>
    );
}