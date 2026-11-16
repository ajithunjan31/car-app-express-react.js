import { useEffect, useState } from 'react'
import CarCard from './components/Card'
import Navbar from './components/Navbar'

function App() {
  const [cars, setCars] = useState([])
  const [form, setForm] = useState({ model: '', brand: '', year: '' })
  const [editingCarId, setEditingCarId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('http://localhost:5000')
        if (!response.ok) {
          throw new Error('Unable to load cars.')
        }
        const data = await response.json()
        setCars(data)
      } catch (error) {
        setError(error.message)
      }
    }
    getData()
  }, [])

  async function handleFormSubmit(event) {
    event.preventDefault()
    setError('')

    const isEditing = editingCarId !== null
    try {
      const response = await fetch(
        isEditing
          ? `http://localhost:5000/update/${editingCarId}`
          : 'http://localhost:5000/create',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      )
      if (!response.ok) {
        throw new Error(isEditing ? 'Unable to update car.' : 'Unable to add car.')
      }

      const savedCar = await response.json()
      if (isEditing) {
        setCars((currentCars) =>
          currentCars.map((car) => (car.id === savedCar.id ? savedCar : car)),
        )
      } else {
        setCars((currentCars) => [...currentCars, savedCar])
      }

      resetForm()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function startEditing(car) {
    setEditingCarId(car.id)
    setForm({ model: car.model, brand: car.brand, year: car.year })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingCarId(null)
    setForm({ model: '', brand: '', year: '' })
  }

  async function handleDelete(id) {
    setError('')
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Unable to delete car.')
      }
      setCars((currentCars) => currentCars.filter((car) => car.id !== id))
      if (editingCarId === id) {
        resetForm()
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div>
      <Navbar />

      <main style={{ width: "90vw", margin: "auto" }}>
        <h1>{editingCarId === null ? 'Add New Car' : 'Edit Car'}</h1>

        <form onSubmit={handleFormSubmit} className="car-form">
          <div className="form-group">
            <label htmlFor="model">Car Model</label>
            <input
              id="model"
              name="model"
              type="text"
              placeholder="S Class"
              value={form.model}
              onChange={(event) => setForm({ ...form, model: event.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Car Brand</label>
            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="Mercedes"
              value={form.brand}
              onChange={(event) => setForm({ ...form, brand: event.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Car Year</label>
            <input
              id="year"
              name="year"
              type="number"
              placeholder="2025"
              value={form.year}
              onChange={(event) => setForm({ ...form, year: event.target.value })}
              required
            />
          </div>

          <button type="submit" className="add-car-btn">
            {editingCarId === null ? 'Add Car' : 'Save Changes'}
          </button>
          {editingCarId !== null && (
            <button type="button" className="cancel-edit-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </main>

      <hr />

      <h1>All Cars</h1>
      <div className='container'>
        {
          cars.map((car) =>
            <CarCard
              key={car.id}
              id={car.id}
              model={car.model}
              brand={car.brand}
              year={car.year}
              onEdit={() => startEditing(car)}
              onDelete={() => handleDelete(car.id)}
            />
          )
        }
      </div>

    </div>
  )
}

export default App
