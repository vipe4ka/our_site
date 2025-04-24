export default function CardItem({ nickname, fcount }) {
  return (
    <>
      <div className="card-user">
        <div className="card-top"></div>
        <div className="card-content">
          <div className="card-text">
            <p className="card-header">{nickname.toUpperCase()}</p>
            <p className="card-description">{fcount}</p>
          </div>
          <div className="card-image">
            <img src="/pictures/cardIcon.png" alt='crd-icon'></img>
          </div>
        </div>
      </div>
    </>
  );
}
