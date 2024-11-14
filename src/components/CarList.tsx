import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Car = {
  id: string
  title: string
  description: string
}

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get('http://localhost:5000/api/cars/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCars(response.data)
      } catch (error) {
        console.error('Error fetching cars:', error)
      }
    }

    fetchCars()
  }, [])

  const filteredCars = cars.filter(car =>
    car?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Cars</h2>
        <Button asChild>
          <Link to="/cars/new">Add New Car</Link>
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Search cars..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map(car => (
          <Card key={car?.id}>
            <CardHeader>
              <CardTitle>{car?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{car?.description.substring(0, 100)}...</p>
              <Button asChild className="mt-4">
                <Link to={`/cars/${car?.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}