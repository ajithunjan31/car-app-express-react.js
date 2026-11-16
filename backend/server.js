import express from "express" //  to use import statement add "type": "module" in scripts (package.json)
import cors from "cors"

const app = express() // initialize express app
const PORT = 5000

// 1. Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Allow only this frontend (npm i cors)
}))

// Fake Car data 
let cars = [
    {id: 1, model: "5 series", brand: "BMW", year: 2023},
    {id: 2, model: "Fortuner", brand: "Toyota", year: 2020},
    {id: 3, model: "XUV 700", brand: "Mahindra", year: 2026},
    {id: 4, model: "s series", brand: "Mercedes", year: 2024},
]

// apis 
// get all cars
app.get("/", (req, res) => {
    res.json(cars)
})

// get a single car
app.get("/:id", (req, res) => {
    
    const id = Number(req.params.id)

    let car = cars.find((car) => car.id === id)

    res.json(car)
})

app.post("/create", (req, res) => {
    const {model, brand, year} = req.body

    let newCar = {
        id: Math.max(0, ...cars.map((car) => car.id)) + 1,
        model: model,
        brand: brand, 
        year: year
    }

    cars.push(newCar)

    res.status(201).json(newCar)
})

app.put("/update/:id", (req, res) => {
    const id = Number(req.params.id)
    const car = cars.find((car) => car.id === id)

    if (!car) {
        return res.status(404).json({ error: "Car not found" })
    }

    const {model, brand, year} = req.body
    if (model !== undefined) car.model = model
    if (brand !== undefined) car.brand = brand
    if (year !== undefined) car.year = year

    res.json(car)
})

app.delete("/delete/:id", (req, res) => {
    const id = Number(req.params.id)
    const carIndex = cars.findIndex((car) => car.id === id)

    if (carIndex === -1) {
        return res.status(404).json({ error: "Car not found" })
    }

    cars.splice(carIndex, 1)
    res.json(cars)
})

app.listen(PORT, () => { // listen express app at port 5000
    console.log(`Server started at port: ${PORT}`)
})