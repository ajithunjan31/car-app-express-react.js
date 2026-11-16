
function CarCard({ brand, model, year, onEdit, onDelete }) {
  return (
    <div className="car-card">

      <h2>{brand}</h2>

      <h3>{model}</h3>

      <div className="car-year">
        <span>Manufacturing Year</span>
        <span className="year">{year}</span>
      </div>

      <div className="btns">
        <button className="btn" type="button" onClick={onEdit}>Edit</button>
        <button className="btn" type="button" onClick={onDelete}>Delete</button>
      </div>

    </div>
  );
}

export default CarCard;