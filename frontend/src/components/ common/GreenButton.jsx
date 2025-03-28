
export default function GreenButton(props){
    const {content, handle, mode} = props;
    
    return(
        <button type="button" className={mode} onClick={handle}>
            <span>{content}</span>
        </button>
    )
}